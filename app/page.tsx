import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Hi, I'm Tobias.
      </h1>
      <p className="mb-4">
        {`Recent Computer Science graduate interested in building better software. \n 
          On this page you can find some of the projects I've worked on, 
          as well as my thoughts on a myriad of topics including my experience with homelabbing, 
          the future of transformative AI, experiments with small-scale manufacturing
          and building mechanical keyboards.
          `}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
