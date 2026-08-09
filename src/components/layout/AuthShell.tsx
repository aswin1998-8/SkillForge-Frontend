import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(77,142,255,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(49,49,192,0.18),_transparent_50%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2.5 text-on-surface"
        >
          <BrandLogo size={32} priority />
          <span className="font-[family-name:var(--font-geist)] text-lg font-semibold tracking-tight">
            Honed
          </span>
        </Link>
        <div className="rounded border border-border-subtle bg-surface-container/90 p-4 backdrop-blur sm:p-6">
          <h1 className="headline-md">{title}</h1>
          {subtitle ? (
            <p className="mt-1 body-sm text-on-surface-variant">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
