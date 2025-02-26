"use client";
export default function MailToButton() {
  return (
    <button
      onClick={() => (window.location.href = "mailto:hello@jennerjahn.xyz")}
      className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 active:bg-stone-300 transition-colors text-stone-900 my-8 cursor-pointer"
    >
      Say Hello
    </button>
  );
}
