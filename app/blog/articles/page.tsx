import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Blog",
  description: "My writings and book reviews.",
};

export default function Page() {
  permanentRedirect("/blog");
}
