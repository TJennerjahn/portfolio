# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Demo

https://portfolio-blog-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).

## Writing Posts with Obsidian

Open `content/blog` as an Obsidian vault. Blog articles live in
`content/blog/Articles`, book reviews live in `content/blog/Reviews`, and shared
post images live in `content/blog/Attachments`.

Press `Cmd+N` / `Ctrl+N` in Obsidian to open the blog-entry selector. Choose
`Blog Article` or `Book Review`, enter the title, and the vault-local
`Blog Entry Templates` plugin creates the note in the correct folder with the
frontmatter populated.

Images pasted or dragged into a note are stored in `content/blog/Attachments`.
The site syncs that folder to `public/blog-images` before development and
production builds.

The templates in `content/blog/Templates` include the frontmatter the site
expects:

- `type: Post` for normal blog articles
- `type: Review` plus `isbn` and `rating` fields for book reviews
- `draft: true` until the post should be published
- `slug` for the public `/blog/:slug` URL

The site understands standard Markdown links and images as well as Obsidian
wikilinks. Examples:

```markdown
[[Another Post]]
[[Another Post|custom link text]]
![Screenshot](../Attachments/screenshot.png)
![[screenshot.png|Screenshot]]
```

Run the site normally while editing:

```bash
npm run dev
```

`npm run dev` watches attachments and keeps `public/blog-images` in sync while
you paste images. `npm run build` runs the sync once before building.
