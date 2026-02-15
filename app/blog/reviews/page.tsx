import { getPosts } from "app/blog/utils";
import { BookReview } from "components/BookReview";
import getBookByISBN, { BookData, EMPTY_BOOK_DATA } from "lib/hardcover";

export const metadata = {
  title: "Reviews",
  description: "Book and other media reviews",
};

export default async function Page() {
  const reviews = getPosts().filter((e) => e.metadata.type === "Review");

  // Create a map to store book data for each review
  const bookDataMap = new Map<string, BookData>();

  // Fetch book data for each review
  for (const review of reviews) {
    if (review.metadata.isbn) {
      const bookData = await getBookByISBN(review.metadata.isbn);
      bookDataMap.set(review.slug, bookData);
    }
  }

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
              bookData={bookDataMap.get(post.slug) ?? EMPTY_BOOK_DATA}
            />
          ))}
      </div>
    </section>
  );
}
