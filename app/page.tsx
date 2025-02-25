import Image from "next/image";
import MailToButton from "./components/mailtoButton";
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
      <div className="mb-4 text-gray-400">
        <p>I build software and write about things. </p>

        <p>Some of my past work can be seen on the Projects page.</p>
        <p>
          If you're interested in transformative AI, small-scale manufacturing,
          productivity or mechanical keyboard, check out my Blog.
        </p>
        <p>Send me a message if you want to hire me or just chat.</p>
      </div>
      <MailToButton />
    </section>
  );
}
