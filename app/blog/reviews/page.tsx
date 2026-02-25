import { getPosts } from "app/blog/utils";
import { BookReview } from "components/BookReview";
import bookDataBySlug from "app/blog/reviews/book-data.generated.json";
import { BookData, EMPTY_BOOK_DATA } from "lib/book-data";

export const metadata = {
  title: "Reviews",
  description: "Book and other media reviews",
};

export default function Page() {
  const reviews = getPosts().filter((e) => e.metadata.type === "Review");
  const cachedBookDataBySlug = bookDataBySlug as Record<string, BookData>;

  return (
    <section className="md:max-w-xl md:mx-auto">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Reviews</h1>

      <div>
        {reviews
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <BookReview
              key={post.slug}
              post={post}
              bookData={cachedBookDataBySlug[post.slug] ?? EMPTY_BOOK_DATA}
            />
          ))}
      </div>
    </section>
  );
}
