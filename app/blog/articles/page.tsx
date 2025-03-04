import { BlogPosts } from "components/posts";

export const metadata = {
  title: "Articles",
  description: "My writings.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Articles</h1>
      <BlogPosts />
    </section>
  );
}
