import { BookReviews } from "components/BookReviews";
import { ErrorBoundary } from "components/ErrorBoundary";

export const metadata = {
  title: "Reviews",
  description: "Book and other media reviews",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Reviews</h1>
      <ErrorBoundary
        fallback={
          <div className="text-neutral-700 dark:text-neutral-300">
            <p>Unable to load book data. Showing basic review list instead.</p>
            <BookReviews />
          </div>
        }
      >
        <BookReviews />
      </ErrorBoundary>
    </section>
  );
}
