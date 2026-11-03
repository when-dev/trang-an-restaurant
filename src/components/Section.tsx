export function SectionHeading({
  eyebrow,
  title,
  text,
  id,
  as: H = "h2",
  className = "",
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className={`eyebrow ${tone === "light" ? "!text-cream/70" : ""}`}>{eyebrow}</p>
      <H
        id={id}
        className={`font-display mt-4 text-4xl leading-[1.05] sm:text-5xl ${tone === "light" ? "text-cream" : "text-forest"}`}
      >
        {title}
      </H>
      {text && (
        <p className={`mt-5 text-lg leading-relaxed ${tone === "light" ? "text-cream/80" : "text-muted"}`}>{text}</p>
      )}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="container-page pt-10 pb-10 sm:pt-16 lg:pt-20">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} className="reveal max-w-3xl" />
    </div>
  );
}
