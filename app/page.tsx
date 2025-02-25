import Image from "next/image";
export default function Page() {
  return (
    <section className="flex flex-col items-start">
      <div className="relative mb-6 w-16 rounded-full overflow-hidden shadow-sm">
        <Image
          src="/profile.png"
          alt="Tobias"
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      <h1 className="mb-8 text-2xl font-light tracking-tighter">
        Hi, I'm Tobias.
      </h1>
      <p className="mb-4 text-gray-400">
        {`Recent Computer Science graduate interested in building better software. \n 
          On this page you can find some of the projects I've worked on, 
          as well as my thoughts on a myriad of topics including my experience with homelabbing, 
          the future of transformative AI, experiments with small-scale manufacturing
          and building mechanical keyboards.
          `}
      </p>
    </section>
  );
}
