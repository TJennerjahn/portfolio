import Link from "next/link";
import { CalendarDays, FileText } from "lucide-react";
import { Post, formatDate, getPostDescription } from "app/blog/utils";

export function BlogPost({ post }: { post: Post }) {
  return (
    <div>
      <Link
        key={post.slug}
        className="group mb-5 flex rounded-lg border border-neutral-200 bg-neutral-50/80 px-4 py-3 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
        href={`/blog/${post.slug}`}
      >
        <div className="flex w-full gap-x-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-neutral-500 ring-1 ring-neutral-200 transition-colors group-hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-800 dark:group-hover:text-neutral-100">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-neutral-900 dark:text-neutral-100 font-medium">
              {post.metadata.title}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {getPostDescription(post)}
            </p>
            <div className="mt-2 flex items-center gap-x-1 text-xs text-neutral-500 dark:text-neutral-500">
              <CalendarDays size={12} />
              <p className="tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
