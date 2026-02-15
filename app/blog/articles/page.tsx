import { formatDate, getPosts } from "app/blog/utils";
import { BlogPost } from "components/BlogPost";

export const metadata = {
  title: "Articles",
  description: "My writings.",
};

export default function Page() {
  const blogPosts = getPosts().filter((e) => e.metadata.type === "Post");
  return (
    <section className="md:max-w-xl md:mx-auto">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Articles</h1>

      <div>
        {blogPosts
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
            <BlogPost post={post} />
          ))}
      </div>
    </section>
  );
}
