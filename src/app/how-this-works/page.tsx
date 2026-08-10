import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function HowThisWorksPage() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={24} />
            <span className="headline-sm text-on-surface">Honed</span>
          </Link>
          <Link
            href="/signup"
            className="rounded bg-primary px-4 py-1.5 body-sm font-semibold text-on-primary"
            style={{ color: "#002e6a", backgroundColor: "#adc6ff" }}
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 py-12">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-widest text-primary">
          Methodology
        </p>
        <h1 className="mt-3 display-sm text-on-surface">How this works</h1>
        <p className="mt-4 max-w-2xl body-lg text-on-surface-variant">
          Honed runs Skill Gap Analysis with transparent, inspectable methods —
          not opaque AI grading of your career risk.
        </p>

        <div className="mt-10 space-y-8">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-6">
            <h2 className="headline-sm text-on-surface">Rule-based scoring</h2>
            <p className="mt-3 body-sm text-on-surface-variant">
              Quick Score and diagnostic checks use deterministic rubrics and
              weighted multiple-choice answers. You can replay the same inputs
              and get the same score. There is no black-box model inventing a
              pass/fail judgment of your worth.
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-6">
            <h2 className="headline-sm text-on-surface">
              Self-assessment debriefs
            </h2>
            <p className="mt-3 body-sm text-on-surface-variant">
              After each challenge you compare your work to a model answer and
              check off rubric items yourself. Follow-up questions appear only
              for unchecked items. Strengths, gaps, and next focus come from
              that checklist — not from an LLM rewriting your solution.
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-6">
            <h2 className="headline-sm text-on-surface">
              Dated evidence sources
            </h2>
            <p className="mt-3 body-sm text-on-surface-variant">
              Synthesis fragments can cite market evidence with a source name
              and date so you can verify context. Claims are labeled with when
              they were published, not presented as timeless truth.
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-6">
            <h2 className="headline-sm text-on-surface">
              Roadmap = completed challenges query
            </h2>
            <p className="mt-3 body-sm text-on-surface-variant">
              Your roadmap is assembled from diagnostic priorities and the
              challenges you complete. Status moves from not started → in
              progress → closed as you finish work. It is a query over your
              activity, not a static curriculum brochure.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-xl px-6 py-3 body-sm font-medium text-white"
            style={{ backgroundColor: "#3B82F6" }}
          >
            Start with a Skill Gap Analysis
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-xl border border-outline-variant/40 px-6 py-3 body-sm text-on-surface"
          >
            Back to landing
          </Link>
        </div>
      </main>
    </div>
  );
}
