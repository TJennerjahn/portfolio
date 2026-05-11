const {
  Modal,
  Notice,
  Plugin,
  Setting,
  SuggestModal,
  TFile,
  normalizePath,
} = require("obsidian");

const ENTRY_TYPES = [
  {
    label: "Blog Article",
    description: "Create a normal blog post in Articles",
    folder: "Articles",
    template: "Templates/Blog Article.md",
  },
  {
    label: "Book Review",
    description: "Create a book review in Reviews",
    folder: "Reviews",
    template: "Templates/Book Review.md",
  },
];

module.exports = class BlogEntryTemplatesPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "new-blog-entry",
      name: "New blog entry from template",
      callback: () => new BlogEntryTypeModal(this.app).open(),
    });
  }
};

class BlogEntryTypeModal extends SuggestModal {
  constructor(app) {
    super(app);
    this.setPlaceholder("Choose a blog entry template");
  }

  getSuggestions(query) {
    const normalizedQuery = query.toLowerCase();

    return ENTRY_TYPES.filter((entryType) =>
      `${entryType.label} ${entryType.description}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }

  renderSuggestion(entryType, element) {
    element.createEl("div", { text: entryType.label });
    element.createEl("small", { text: entryType.description });
  }

  onChooseSuggestion(entryType) {
    new BlogEntryTitleModal(this.app, entryType).open();
  }
}

class BlogEntryTitleModal extends Modal {
  constructor(app, entryType) {
    super(app);
    this.entryType = entryType;
    this.title = "";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: `New ${this.entryType.label}` });

    new Setting(contentEl)
      .setName("Title")
      .setDesc("Used for the note name, frontmatter title, alias, and default slug.")
      .addText((text) => {
        text.setPlaceholder("My new post");
        text.onChange((value) => {
          this.title = value;
        });
        text.inputEl.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            this.createEntry();
          }
        });
        window.setTimeout(() => text.inputEl.focus(), 0);
      });

    new Setting(contentEl)
      .addButton((button) =>
        button
          .setButtonText("Create")
          .setCta()
          .onClick(() => this.createEntry()),
      )
      .addButton((button) =>
        button
          .setButtonText("Cancel")
          .onClick(() => this.close()),
      );
  }

  onClose() {
    this.contentEl.empty();
  }

  async createEntry() {
    const title = this.title.trim();
    if (!title) {
      new Notice("Add a title before creating the entry.");
      return;
    }

    try {
      const file = await createEntryFromTemplate(this.app, this.entryType, title);
      this.close();
      await this.app.workspace.getLeaf(false).openFile(file);
    } catch (error) {
      new Notice(error instanceof Error ? error.message : "Could not create entry.");
    }
  }
}

async function createEntryFromTemplate(app, entryType, title) {
  const templateFile = app.vault.getAbstractFileByPath(entryType.template);
  if (!(templateFile instanceof TFile)) {
    throw new Error(`Missing template: ${entryType.template}`);
  }

  await ensureFolder(app, entryType.folder);

  const template = await app.vault.read(templateFile);
  const date = formatDate(new Date());
  const slug = slugify(title) || date;
  const content = replaceTemplateVariables(template, { title, slug, date });
  const notePath = await getAvailableNotePath(app, entryType.folder, title);

  return app.vault.create(notePath, content);
}

async function ensureFolder(app, folderPath) {
  const normalizedPath = normalizePath(folderPath);

  if (!(await app.vault.adapter.exists(normalizedPath))) {
    await app.vault.createFolder(normalizedPath);
  }
}

async function getAvailableNotePath(app, folderPath, title) {
  const fileName = sanitizeFileName(title) || "Untitled";
  let candidate = normalizePath(`${folderPath}/${fileName}.md`);
  let index = 2;

  while (await app.vault.adapter.exists(candidate)) {
    candidate = normalizePath(`${folderPath}/${fileName} ${index}.md`);
    index += 1;
  }

  return candidate;
}

function replaceTemplateVariables(template, variables) {
  const yamlTitle = escapeYamlDoubleQuoted(variables.title);

  return template
    .replaceAll('title: "{{title}}"', `title: "${yamlTitle}"`)
    .replaceAll('- "{{title}}"', `- "${yamlTitle}"`)
    .replaceAll("{{title}}", variables.title)
    .replaceAll("{{slug}}", variables.slug)
    .replaceAll("{{date}}", variables.date)
    .replaceAll("{{date:YYYY-MM-DD}}", variables.date);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFileName(value) {
  return value
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeYamlDoubleQuoted(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
