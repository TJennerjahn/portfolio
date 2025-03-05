import { formatDate, getPosts } from "app/blog/utils";
import { BookReview } from "components/BookReview";
export const metadata = {
  title: "Reviews",
  description: "Book and other media reviews",
};

export default function Page() {
  const reviews = getPosts().filter((e) => e.metadata.type === "Review");
  return (
    <section>
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
            <BookReview post={post} />
          ))}
      </div>
    </section>
  );
}
