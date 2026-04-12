import { NextRequest, NextResponse } from "next/server";
import {
  DECAP_GITHUB_BRANCH,
  DECAP_GITHUB_REPO,
  DECAP_MEDIA_FOLDER,
  DECAP_PUBLIC_FOLDER,
  isDecapAuthConfigured,
} from "app/api/decap/shared";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  return NextResponse.json({
    authConfigured: isDecapAuthConfigured(),
    config: {
      backend: {
        name: "github",
        repo: DECAP_GITHUB_REPO,
        branch: DECAP_GITHUB_BRANCH,
        base_url: origin,
        auth_endpoint: "api/decap/auth",
        site_domain: request.nextUrl.hostname,
      },
      local_backend: true,
      publish_mode: "simple",
      media_folder: DECAP_MEDIA_FOLDER,
      public_folder: DECAP_PUBLIC_FOLDER,
      collections: [
        {
          name: "posts",
          label: "Posts",
          label_singular: "Post",
          folder: "app/blog/posts",
          create: true,
          extension: "mdx",
          format: "frontmatter",
          slug: "{{slug}}",
          identifier_field: "title",
          summary: "{{title}} — {{publishedAt}}",
          sortable_fields: ["publishedAt", "title", "commit_date"],
          editor: {
            preview: false,
          },
          fields: [
            { label: "Title", name: "title", widget: "string" },
            {
              label: "Type",
              name: "type",
              widget: "select",
              options: ["Post", "Review"],
              default: "Post",
            },
            {
              label: "Published",
              name: "publishedAt",
              widget: "datetime",
              format: "YYYY-MM-DD",
              date_format: "YYYY-MM-DD",
              time_format: false,
              picker_utc: true,
            },
            {
              label: "Summary",
              name: "summary",
              widget: "text",
              required: false,
              hint: "Optional. Falls back to an excerpt when omitted.",
            },
            {
              label: "Open Graph Image",
              name: "image",
              widget: "image",
              required: false,
              hint: "Optional social preview image.",
            },
            {
              label: "ISBN",
              name: "isbn",
              widget: "string",
              required: false,
              hint: "Only needed for reviews.",
            },
            {
              label: "Rating",
              name: "rating",
              widget: "string",
              required: false,
              hint: "Optional. Kept as a string to preserve existing content.",
            },
            {
              label: "Body",
              name: "body",
              widget: "markdown",
              modes: ["rich_text", "raw"],
            },
          ],
        },
      ],
    },
  });
}
