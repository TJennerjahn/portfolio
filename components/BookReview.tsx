import Link from "next/link";
import { Post, formatDate } from "app/blog/utils";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { BookData } from "lib/hardcover";

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
        className="flex flex-col space-y-1 mb-4 group"
        href={`/blog/${post.slug}`}
      >
        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-4">
          {bookData.imageUrl ? (
            <div className="min-h-36 min-w-24 relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image
                src={bookData.imageUrl.toString()}
                alt={`Cover for ${post.metadata.title}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <span className="w-24 h-36 rounded-lg bg-gray-500 flex items-center justify-center text-xs transition-transform duration-300 group-hover:scale-105">
              No Cover
            </span>
          )}
          <div className="flex flex-col items-start w-full">
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight font-bold">
              {post.metadata.title}
            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
              {formatDate(post.metadata.publishedAt, false)}
            </p>

            <p className="text-xs text-neutral-300 text-justify w-4/5 max-h-36 py-2">
              {bookData.description.length > 250
                ? `${bookData.description.substring(0, 250)}...`
                : bookData.description}
            </p>

            <div className="flex gap-x-1 items-center text-neutral-400">
              <BookOpen size={12} />
              <p className="text-xs">{bookData.pageCount}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
