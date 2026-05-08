import Link from "next/link";
import { Post, formatDate } from "app/blog/utils";
import Image from "next/image";
import { BookOpen, CalendarDays, UserPen } from "lucide-react";
import { BookData } from "lib/book-data";

export function BookReview({
  post,
  bookData,
}: {
  post: Post;
  bookData: BookData;
}) {
  return (
    <div>
      <Link
        key={post.slug}
        className="group mb-5 flex rounded-lg border border-neutral-200 bg-neutral-50/80 px-4 py-3 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
        href={`/blog/${post.slug}`}
      >
        <div className="w-full flex items-start justify-between gap-x-4">
          <div className="flex flex-col items-start w-full min-w-0 pt-1">
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight font-bold">
              {post.metadata.title}
            </p>

            <div className="flex gap-x-1 items-center">
              <UserPen size={14} />
              <p>{bookData.authors.join(", ")}</p>
            </div>

            <p className="text-xs text-neutral-300 line-clamp-4 py-2">
              {bookData.description.length > 250
                ? `${bookData.description.substring(0, 250)}...`
                : bookData.description}
            </p>

            <div className="flex gap-x-4 items-center text-xs text-neutral-400">
              {bookData.pageCount && (
                <div className="flex gap-x-1 items-center">
                  <BookOpen size={12} />
                  <p className="text-xs">{bookData.pageCount}</p>
                </div>
              )}
              <div className="flex gap-x-1 items-center">
                <CalendarDays size={12} />
                <p className="tabular-nums">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </div>
            </div>
          </div>
          {bookData.imageUrl ? (
            <div
              className="relative h-36 w-24 shrink-0 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                position: "relative",
                width: "6rem",
                height: "9rem",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "0.5rem",
              }}
            >
              <Image
                src={bookData.imageUrl.toString()}
                alt={`Cover for ${post.metadata.title}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <span className="h-36 w-24 shrink-0 rounded-lg bg-gray-500 flex items-center justify-center text-xs transition-transform duration-300 group-hover:scale-105">
              No Cover
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
