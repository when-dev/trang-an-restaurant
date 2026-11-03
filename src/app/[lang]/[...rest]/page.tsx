import { notFound } from "next/navigation";

/** Unknown paths below a locale (e.g. /sk/xyz) render the localized not-found page. */
export default function CatchAll() {
  notFound();
}
