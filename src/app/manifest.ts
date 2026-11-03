import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trang An — Vietnamská reštaurácia",
    short_name: "Trang An",
    description: "Vietnamská reštaurácia na Železničiarskej v Bratislave.",
    start_url: "/sk",
    display: "standalone",
    background_color: "#F8F5ED",
    theme_color: "#12382C",
    lang: "sk",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
