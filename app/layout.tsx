import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans, Montserrat } from "next/font/google";
import { Navbar } from "../components/nav";
// import Footer from "./components/footer";
import { baseUrl } from "./sitemap";

const noto = Noto_Sans({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Tobias Jennerjahn Personal Site",
    template: "%s | Tobias Jennerjahn Personal Site",
  },
  description:
    "This is my personal Site. It contains projects I've worked on and my personal writings.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body
        className={`antialiased mx-4 mt-8 md:mx-auto ${montserrat.className}`}
      >
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          {/* <Footer /> */}
        </main>
      </body>
    </html>
  );
}
