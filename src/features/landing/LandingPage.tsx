"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { FeatureCard } from "@/features/landing/FeatureCard";
import { WaitlistModal } from "@/features/landing/WaitlistModal";

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

function PracticePreview() {
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
            Honed | war-room.incident.log
          </div>
        </div>
        <div className="relative flex flex-1 flex-col gap-3 overflow-hidden bg-surface-container-low p-4">
          <div className="flex items-center gap-1 self-end rounded border border-primary/20 bg-primary/10 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-primary">
            <MaterialIcon name="radar" className="text-[14px]" />
            JOB-SHAPED PRACTICE
          </div>
          <pre className="flex-1 overflow-auto rounded border border-outline-variant bg-surface p-4 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed text-on-surface">
            {`ERROR checkout.views charge()
TypeError: int + NoneType
  File checkout/pricing.py:18 add_tax
  rate=None  merchant_id=9

slack · @priya
  leadership wants an ETA in 10 minutes.
  infra thinks it's Redis.`}
          </pre>
          <div className="rounded border border-outline-variant bg-surface-container px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
            Diagnose · Communicate · Fix — one continuous scenario
          </div>
        </div>
      </div>
    </div>
  );
}

const PHASES = [
  {
    icon: "health_and_safety",
    title: "Diagnose",
    copy: "Adaptive skill gap analysis against your stack and target role. Nail the first three foundational questions in an area and Honed skips the easy grind.",
  },
  {
    icon: "architecture",
    title: "Practice",
    copy: "Challenges that look like work: messy codebases, AI-generated PRs, and on-call incidents — not trivia.",
  },
  {
    icon: "verified",
    title: "Prove",
    copy: "A living roadmap and gap list that close as you complete real tasks. Evidence you can ship, review, and debug.",
  },
] as const;

const FEATURES = [
  {
    icon: "tune",
    title: "Adaptive Skill Gap Analysis",
    description:
      "Not 40 easy questions in a row. Honed asks deeply in fewer areas. Strong areas jump to harder checks. Weak areas still get the basics. Same inputs, same score — no opaque AI judgment.",
    tagline: "Shorter when you’re strong. Thorough when you’re not.",
  },
  {
    icon: "rate_review",
    title: "Audit the AI PR",
    description:
      "A captured AI diff with planted bugs, edge cases, style misses, and security gaps. You find them, categorize them, and get scored against known locations.",
    tagline: "Anyone can prompt. Can you review?",
  },
  {
    icon: "folder_open",
    title: "Inherited Codebase Mode",
    description:
      "Dropped into a small, messy repo with tech debt and a subtle bug: add this feature without breaking X. Tests lock the invariant.",
    tagline: "Almost nobody writes fresh code all day. Prove you can extend a system.",
  },
  {
    icon: "emergency",
    title: "War Room",
    description:
      "A continuous on-call scene: prod 500s, a log dump, a stack trace, a teammate asking for an ETA. Diagnose, communicate, push back, propose a fix.",
    tagline: "Feels like a job, not a quiz.",
  },
] as const;

const BUILT_LIKE_WORK = [
  {
    title: "Executable coding challenges",
    copy: "Write solve(input), run visible tests, submit against hidden cases — aimed at your stack, not random puzzles.",
  },
  {
    title: "Honest debriefs",
    copy: "Compare against a model answer and check the rubric yourself. Follow-ups only for what you missed — not an LLM rewriting your solution.",
  },
  {
    title: "Living roadmap",
    copy: "A query over your diagnostic and completed challenges, not a static curriculum PDF. Gaps open and close as you finish work.",
  },
] as const;

const COMPARISON = [
  {
    tried: "Tutorial hell",
    contrast: "Adaptive skip-ahead; no grinding easy items you already know",
  },
  {
    tried: "LeetCode",
    contrast: "Job-shaped work: PRs, incidents, inherited code",
  },
  {
    tried: "Learn with ChatGPT",
    contrast: "Audit and explain AI output so the tool doesn’t replace the skill",
  },
  {
    tried: "Mystery AI coaches",
    contrast: "Deterministic rubrics you can replay",
  },
] as const;

const STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "Django",
  "FastAPI",
  "Python",
  "PostgreSQL",
];

export function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-inter)] text-on-background">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-4">
            <BrandLogo size={28} priority />
            <span className="headline-sm tracking-tight text-on-surface">
              Honed
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
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="rounded bg-primary px-4 py-1 body-sm font-semibold text-on-primary transition-all hover:brightness-110"
              style={{ color: "#002e6a", backgroundColor: "#adc6ff" }}
            >
              Join waitlist
            </button>
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
                    HONED PLATFORM BETA
                  </span>
                </div>
                <h1 className="w-full max-w-2xl font-[family-name:var(--font-geist)] text-[48px] font-bold leading-[56px] tracking-[-0.04em] text-on-background sm:text-[56px] sm:leading-[64px] lg:text-[64px] lg:leading-[72px]">
                  Stop grinding tutorials. Prove you can do the job.
                </h1>
                <p className="headline-sm w-full max-w-xl text-on-surface-variant">
                  Honed finds the gaps in your stack, then puts you in the work
                  that actually shows up on the job: messy codebases, AI-generated
                  PRs, and on-call incidents — graded with inspectable rules, not
                  a mystery model.
                </p>
                <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setWaitlistOpen(true)}
                    className="group flex items-center justify-center gap-2 rounded px-6 py-4 body-sm font-medium text-white transition-all duration-300 hover:brightness-110"
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    Start a Skill Gap Analysis
                    <MaterialIcon
                      name="arrow_forward"
                      className="text-[18px] transition-transform group-hover:translate-x-1"
                    />
                  </button>
                  <a
                    href="#how-it-works"
                    className="group flex items-center justify-center gap-2 rounded border border-outline-variant bg-transparent px-6 py-4 body-sm text-primary transition-all duration-300 hover:border-primary/40 hover:bg-surface-container-high hover:text-on-surface"
                  >
                    See how it works
                  </a>
                </div>
              </div>
              <PracticePreview />
            </div>
          </section>

          <section
            id="how-it-works"
            className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10"
          >
            <div className="mb-10 text-center">
              <h2 className="headline-md mb-2 text-on-background">
                Diagnose → Practice → Prove
              </h2>
              <p className="body-sm mx-auto max-w-2xl text-on-surface-variant">
                A skill gap analysis and practice gym for engineers who want
                evidence they can ship, review, and debug — including AI-written
                code.
              </p>
            </div>
            <div className="grid grid-cols-1 border border-outline-variant md:grid-cols-3">
              {PHASES.map((phase, index) => (
                <div
                  key={phase.title}
                  className={`flex h-full flex-col bg-surface-container-low p-6 ${
                    index > 0 ? "border-t border-outline-variant md:border-t-0 md:border-l" : ""
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest">
                    <MaterialIcon name={phase.icon} className="text-[22px] text-primary" />
                  </div>
                  <div className="mb-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-[0.02em] text-outline">
                    PHASE 0{index + 1}
                  </div>
                  <h3 className="headline-sm mb-2 text-on-surface">{phase.title}</h3>
                  <p className="body-sm text-on-surface-variant">{phase.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10">
            <h2 className="headline-md mb-6 text-on-background">
              Practice that looks like the job
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>

          <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10">
            <h2 className="headline-md mb-6 text-on-background">Built like work</h2>
            <div className="grid grid-cols-1 border border-outline-variant md:grid-cols-3">
              {BUILT_LIKE_WORK.map((item, index) => (
                <div
                  key={item.title}
                  className={`bg-surface-container-low p-6 ${
                    index > 0 ? "border-t border-outline-variant md:border-t-0 md:border-l" : ""
                  }`}
                >
                  <h3 className="headline-sm mb-2 text-on-surface">{item.title}</h3>
                  <p className="body-sm text-on-surface-variant">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10">
            <h2 className="headline-md mb-6 text-on-background">
              What you&apos;ve tried vs Honed
            </h2>
            <div className="overflow-hidden rounded border border-outline-variant">
              <div className="grid grid-cols-2 bg-surface-container-high px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-on-surface-variant">
                <span>What you&apos;ve tried</span>
                <span>Honed&apos;s contrast</span>
              </div>
              {COMPARISON.map((row) => (
                <div
                  key={row.tried}
                  className="grid grid-cols-1 border-t border-outline-variant bg-surface-container-low sm:grid-cols-2"
                >
                  <p className="body-sm border-b border-outline-variant/40 p-4 text-on-surface-variant sm:border-b-0 sm:border-r">
                    {row.tried}
                  </p>
                  <p className="body-sm p-4 text-on-surface">{row.contrast}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-on-surface-variant">
              Stacks
            </p>
            <div className="flex flex-wrap gap-2">
              {STACKS.map((stack) => (
                <span
                  key={stack}
                  className="rounded-full border border-outline-variant bg-surface-container px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface"
                >
                  {stack}
                </span>
              ))}
            </div>
          </section>

          <section className="mx-auto mb-10 w-full max-w-[1440px] px-6 py-10 text-center">
            <h2 className="headline-md mb-4 text-on-background">
              Ready to see your gaps?
            </h2>
            <p className="body-sm mx-auto mb-6 max-w-xl text-on-surface-variant">
              Join the waitlist for a Skill Gap Analysis, then a personalized
              report and practice roadmap.
            </p>
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="inline-block rounded px-10 py-4 body-lg font-semibold transition-all duration-300 hover:brightness-110"
              style={{ backgroundColor: "#adc6ff", color: "#002e6a" }}
            >
              Start a Skill Gap Analysis
            </button>
          </section>
        </div>
      </main>

      <footer className="border-t border-outline-variant/20 bg-surface-container-lowest py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 body-sm text-on-surface-variant md:flex-row">
          <div>© {new Date().getFullYear()} Honed Systems Inc.</div>
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

      <Suspense fallback={null}>
        <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
        />
      </Suspense>
    </div>
  );
}
