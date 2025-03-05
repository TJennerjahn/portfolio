import Link from "next/link";
import { Post, formatDate } from "app/blog/utils";

export function BookReview({ post }: { post: Post }) {
  return (
    <div>
      <Link
        key={post.slug}
        className="flex flex-col space-y-1 mb-4"
        href={`/blog/${post.slug}`}
      >
        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
          <span className="w-24 h-36 rounded-lg bg-gray-500 flex items-center justify-center text-xs">
            No Cover
          </span>
          <div className="flex flex-col items-start">
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
              {post.metadata.title}
            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
              {formatDate(post.metadata.publishedAt, false)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
