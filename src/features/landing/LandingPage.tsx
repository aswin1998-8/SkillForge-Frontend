"use client";

import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/common/BrandLogo";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {name}
    </span>
  );
}

function AssessmentPreview() {
  return (
    <div className="relative mt-10 w-full lg:col-span-5 lg:mt-0">
      <div className="relative z-10 flex h-[min(520px,70vh)] flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-lowest">
        <div className="flex h-10 items-center gap-2 border-b border-outline-variant bg-surface-container px-4">
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
            <div className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
            <div className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
          </div>
          <div className="flex-1 text-center font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-outline">
            ForgeIQ | Assessment/Terminal.env.ts
          </div>
        </div>

        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden bg-surface-container-low p-4">
          <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-primary backdrop-blur-md">
            <MaterialIcon name="radar" className="text-[14px]" />
            GAP ANALYSIS ACTIVE
          </div>

          <div className="flex items-start gap-4 rounded border border-outline-variant bg-surface-container p-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-outline-variant bg-surface">
              <MaterialIcon name="terminal" className="text-[22px] text-primary" />
            </div>
            <div className="pr-28">
              <div className="mb-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                TARGET ROLE
              </div>
              <div className="headline-sm text-on-surface">AI Engineer (L4)</div>
              <div className="body-sm mt-1 text-on-surface-variant">
                Current baseline: Frontend Developer
              </div>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded border border-outline-variant bg-surface p-4 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed">
            <div className="mb-2 text-outline">
              {"// Assessing core competencies..."}
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">1</span>
              <span className="text-tertiary">const</span>&nbsp;
              <span className="text-secondary">analyzeSkills</span>&nbsp;=&nbsp;
              <span className="text-tertiary">async</span>&nbsp;(profile)&nbsp;
              <span className="text-tertiary">=&gt;</span>&nbsp;{"{"}
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">2</span>
              &nbsp;&nbsp;<span className="text-primary">await</span>
              &nbsp;validateVectorMath();
              <span className="ml-2 text-error">{"// FAILED"}</span>
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">3</span>
              &nbsp;&nbsp;<span className="text-primary">await</span>
              &nbsp;validateTransformerArch();
              <span className="ml-2 text-error">{"// FAILED"}</span>
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">4</span>
              &nbsp;&nbsp;<span className="text-primary">await</span>
              &nbsp;validateDataPipelines();
              <span className="ml-2 text-warning">{"// PARTIAL"}</span>
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">5</span>
              &nbsp;&nbsp;<span className="text-primary">await</span>
              &nbsp;validateAPIDesign();
              <span className="ml-2 text-success">{"// PASSED"}</span>
            </div>
            <div className="flex text-on-surface">
              <span className="w-6 select-none text-outline">6</span>
              {"}"}
            </div>
          </div>

          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-1 rounded border border-outline-variant bg-surface-bright py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <MaterialIcon name="play_arrow" className="text-[16px]" />
            GENERATE CURRICULUM
          </Link>
        </div>
      </div>
    </div>
  );
}

const phases = [
  {
    icon: "health_and_safety",
    iconClass: "text-error",
    phase: "PHASE 01",
    title: "Diagnose",
    copy: "Pinpoint precise knowledge gaps against real-world role requirements. No more guessing what to learn next.",
  },
  {
    icon: "architecture",
    iconClass: "text-primary",
    phase: "PHASE 02",
    title: "Practice",
    copy: "Tackle bespoke engineering scenarios. Write actual code, configure systems, build architecture.",
  },
  {
    icon: "gavel",
    iconClass: "text-tertiary",
    phase: "PHASE 03",
    title: "Defend",
    copy: "Subject your solutions to adversarial review. Justify trade-offs, optimize performance, handle edge cases.",
  },
  {
    icon: "trending_up",
    iconClass: "text-secondary",
    phase: "PHASE 04",
    title: "Improve",
    copy: "Iterate on precise technical feedback. Build verifiable confidence through demonstrated proof of skill.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-inter)] text-on-background">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-4">
            <BrandLogo size={28} priority />
            <span className="headline-sm tracking-tight text-on-surface">
              ForgeIQ
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#product"
              className="body-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              className="body-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="body-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded bg-primary px-4 py-1 body-sm font-semibold text-on-primary transition-all hover:brightness-110"
              style={{ color: "#002e6a", backgroundColor: "#adc6ff" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-16">
        <div className="relative flex w-full flex-col overflow-hidden bg-background">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <svg
              className="absolute -left-[10%] -top-[10%] h-[120%] w-[120%] opacity-[0.22]"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <pattern
                  id="forgeiq-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#2d3449"
                    strokeWidth="0.5"
                  />
                </pattern>
                <radialGradient id="forgeiq-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0b1326" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#forgeiq-grid)" />
              <circle cx="50%" cy="18%" r="38%" fill="url(#forgeiq-glow)" />
              <circle
                className="opacity-40"
                cx="82%"
                cy="55%"
                r="28%"
                fill="url(#forgeiq-glow)"
              />
            </svg>
          </div>

          <section
            id="product"
            className="relative z-10 mx-auto flex min-h-[85vh] w-full max-w-[1440px] flex-col justify-center px-6 pb-10 pt-[100px]"
          >
            <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12">
              <div className="relative z-20 flex w-full flex-col items-start gap-6 lg:col-span-7">
                <div className="flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-high px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                    ForgeIQ Platform Beta v2.4
                  </span>
                </div>

                <h1 className="w-full max-w-2xl font-[family-name:var(--font-geist)] text-[48px] font-bold leading-[56px] tracking-[-0.04em] text-on-background sm:text-[56px] sm:leading-[64px] lg:text-[64px] lg:leading-[72px]">
                  Stop{" "}
                  <span className="text-surface-bright/80 line-through decoration-outline-variant">
                    consuming
                  </span>
                  .
                  <br />
                  Start <span className="text-on-surface">proving</span>.
                </h1>

                <p className="headline-sm w-full max-w-xl text-on-surface-variant">
                  Build the technical skills your next role actually requires —
                  one rigorous engineering challenge at a time. Leave tutorial
                  hell behind.
                </p>

                <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                  <Link
                    href="/signup"
                    className="group flex items-center justify-center gap-2 rounded px-6 py-4 body-sm font-medium text-white transition-all duration-300 hover:brightness-110"
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    Find My Skill Gaps
                    <MaterialIcon
                      name="arrow_forward"
                      className="text-[18px] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="group flex items-center justify-center gap-2 rounded border border-outline-variant bg-transparent px-6 py-4 body-sm text-primary transition-all duration-300 hover:border-primary/40 hover:bg-surface-container-high hover:text-on-surface"
                  >
                    <MaterialIcon name="play_circle" className="text-[18px]" />
                    See How It Works
                  </a>
                </div>

                <div className="mt-6 flex w-full max-w-xl items-center gap-4 border-t border-outline-variant/40 pt-6">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] tracking-[0.02em] text-outline-variant">
                    SYSTEM STATUS
                  </span>
                  <div className="h-px flex-1 bg-outline-variant/30" />
                  <span className="flex items-center gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-success">
                    <span aria-hidden>✓</span> OPERATIONAL
                  </span>
                </div>
              </div>

              <AssessmentPreview />
            </div>
          </section>

          <section
            id="how-it-works"
            className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10"
          >
            <div className="relative mb-10 overflow-hidden py-6 text-center">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(173,198,255,0.15) 0%, transparent 70%)",
                }}
              />
              <h2 className="headline-md relative mb-2 text-on-background">
                The Engineering Loop
              </h2>
              <p className="body-sm relative mx-auto max-w-2xl text-on-surface-variant">
                A rigorous, feedback-driven methodology designed to forge genuine
                capability, not just passing familiarity.
              </p>
            </div>

            <div className="grid grid-cols-1 border border-outline-variant md:grid-cols-2 lg:grid-cols-4">
              {phases.map((phase, index) => (
                <div
                  key={phase.phase}
                  className={`group flex h-full flex-col bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high ${
                    index > 0 ? "border-t border-outline-variant lg:border-t-0 lg:border-l" : ""
                  } ${index % 2 === 1 ? "md:border-l" : ""} ${
                    index >= 2 ? "md:border-t lg:border-t-0" : ""
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest">
                    <MaterialIcon
                      name={phase.icon}
                      className={`text-[22px] ${phase.iconClass}`}
                    />
                  </div>
                  <div className="mb-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-[0.02em] text-outline">
                    {phase.phase}
                  </div>
                  <h3 className="headline-sm mb-2 text-on-surface">{phase.title}</h3>
                  <p className="body-sm flex-1 text-on-surface-variant">
                    {phase.copy}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10">
            <div className="flex flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-highest lg:flex-row">
              <div className="relative flex flex-col justify-center overflow-hidden bg-surface-container-lowest p-10 lg:w-1/2">
                <span className="mb-4 block font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary">
                  CASE STUDY
                </span>
                <h2 className="headline-md mb-4 text-on-background">
                  The Evolution Path
                </h2>
                <p className="body-lg mb-6 max-w-xl text-on-surface-variant">
                  Transitioning from Frontend to AI Engineering requires more
                  than prompt engineering. It demands a fundamental shift in
                  mental models—from component state to tensor operations.
                </p>
                <div className="flex w-fit items-center gap-4 rounded border border-outline-variant bg-surface-container p-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                  <span className="rounded bg-surface-variant px-2 py-1 text-on-surface-variant">
                    Frontend Dev
                  </span>
                  <MaterialIcon
                    name="arrow_forward"
                    className="text-[18px] text-outline"
                  />
                  <span className="rounded bg-primary/15 px-2 py-1 text-primary">
                    AI Engineer
                  </span>
                </div>
              </div>

              <div className="relative flex min-h-[400px] flex-col bg-surface lg:w-1/2">
                <div className="relative flex flex-1 items-center justify-center p-6">
                  <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <Image
                      src="/evolution-path.jpg"
                      alt="Network graph morphing from structured hierarchy into a neural network"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="relative z-10 w-full max-w-md space-y-2">
                    <div className="flex translate-x-3 items-center justify-between rounded border border-primary/25 border-l-4 border-l-primary bg-primary/10 p-2 backdrop-blur-sm">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                        Data Structures
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-primary">
                        ◐ RECALIBRATING
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded border border-warning/25 border-l-4 border-l-warning bg-warning/10 p-2 backdrop-blur-sm">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                        Linear Algebra
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-warning">
                        ⚠ GAP DETECTED
                      </span>
                    </div>
                    <div className="flex -translate-x-3 items-center justify-between rounded border border-success/25 border-l-4 border-l-success bg-success/10 p-2 backdrop-blur-sm">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                        API Integration
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-success">
                        ✓ VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 border-t border-outline-variant bg-surface-container-lowest/95 px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-[0.02em] text-on-surface-variant">
                  [ MODE: Adaptive Skill-Tree Transformation ] [ DATA: ACTIVE ]
                  [ LATENCY: 22ms ]{" "}
                  <span className="text-success">[ ACCURACY: 99.8% ]</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mb-10 w-full max-w-[1440px] px-6 py-10 text-center">
            <h2 className="headline-md mb-4 text-on-background">
              Ready to prove it?
            </h2>
            <p className="body-sm mx-auto mb-6 max-w-xl text-on-surface-variant">
              Access the beta and start identifying the specific engineering
              challenges standing between you and your target role.
            </p>
            <Link
              href="/signup"
              className="inline-block rounded px-10 py-4 body-lg font-semibold transition-all duration-300 hover:brightness-110"
              style={{ backgroundColor: "#adc6ff", color: "#002e6a" }}
            >
              Initialize Assessment
            </Link>
          </section>
        </div>
      </main>

      <footer className="border-t border-outline-variant/20 bg-surface-container-lowest py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 body-sm text-on-surface-variant md:flex-row">
          <div>© {new Date().getFullYear()} ForgeIQ Systems Inc.</div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
