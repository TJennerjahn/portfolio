import { getPosts } from "app/blog/utils";
import { BlogPost } from "components/BlogPost";
import { BookReview } from "components/BookReview";
import bookDataBySlug from "app/blog/reviews/book-data.generated.json";
import { BookData, EMPTY_BOOK_DATA } from "lib/book-data";

export const metadata = {
  title: "Blog",
  description: "My writings and book reviews.",
};

export default function Page() {
  const cachedBookDataBySlug = bookDataBySlug as Record<string, BookData>;
  const posts = getPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Blog</h1>

      <div>
        {posts.map((post) =>
          post.metadata.type === "Review" ? (
            <BookReview
              key={post.slug}
              post={post}
              bookData={cachedBookDataBySlug[post.slug] ?? EMPTY_BOOK_DATA}
            />
          ) : (
            <BlogPost key={post.slug} post={post} />
          ),
        )}
      </div>
    </section>
  );
}
