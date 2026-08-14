"use client";

type FeatureCardProps = {
  title: string;
  description: string;
  tagline: string;
  icon: string;
};

export function FeatureCard({
  title,
  description,
  tagline,
  icon,
}: FeatureCardProps) {
  return (
    <article className="flex h-full flex-col border border-outline-variant bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest">
        <span className="material-symbols-outlined text-[22px] text-primary" aria-hidden>
          {icon}
        </span>
      </div>
      <h3 className="headline-sm mb-2 text-on-surface">{title}</h3>
      <p className="body-sm flex-1 text-on-surface-variant">{description}</p>
      <p className="mt-4 body-sm italic text-primary">{tagline}</p>
    </article>
  );
}
