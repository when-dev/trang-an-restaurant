import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { fullAddress } from "@/config/site.config";
import { BowlMark, ogFonts } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trang An — Vietnamská reštaurácia, Bratislava";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Own graphic (no restaurant photos). */
export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#F8F5ED",
        fontFamily: "Manrope",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -260,
          top: -60,
          width: 720,
          height: 720,
          borderRadius: 720,
          background: "#D95137",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -90,
          top: 80,
          width: 470,
          height: 470,
          borderRadius: 470,
          background: "#12382C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BowlMark size={420} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: 760, height: "100%" }}>
        <div style={{ fontSize: 22, color: "#74563B", letterSpacing: 4, textTransform: "uppercase" }}>
          {dict.home.eyebrow}
        </div>
        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: 120,
            color: "#12382C",
            marginTop: 28,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Trang An
        </div>
        <div style={{ fontFamily: "Fraunces", fontSize: 44, color: "#18201B", marginTop: 32, lineHeight: 1.15 }}>
          {dict.home.heroTitle}
        </div>
        <div style={{ fontSize: 26, color: "#4E5A52", marginTop: "auto" }}>{fullAddress}</div>
      </div>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
