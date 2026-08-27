import Link from "next/link";

function ReviewCard({
  tone,
  eyebrow,
  title,
  children,
}: {
  tone: "blue" | "orange" | "green";
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const tones = {
    blue: "bg-[#dceaff] text-[#1e65c1]",
    orange: "bg-[#fff0d7] text-[#c46614]",
    green: "bg-[#e0f5df] text-[#278040]",
  };

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e8e8e3] bg-white text-left shadow-[0_8px_24px_rgba(27,27,23,0.05)]">
      <div className={`px-5 py-6 ${tones[tone]}`}>
        <div className="mb-10 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span>{eyebrow}</span>
          <span className="flex size-6 items-center justify-center rounded-full bg-white/70 text-[14px] normal-case">{tone === "blue" ? "⋯" : tone === "orange" ? "!" : "✓"}</span>
        </div>
        <h3 className="font-pixel text-[25px] leading-[0.98] tracking-[-0.03em] text-[#171717]">{title}</h3>
      </div>
      <div className="space-y-3 px-5 py-5 text-[13px] text-[#686864]">{children}</div>
    </article>
  );
}

function MiniRow({ children, color = "#b4b4af" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{children}</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-[1180px] px-6 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:px-10 lg:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-12 -z-0 size-[420px] -translate-x-1/2 rounded-full bg-[#eef5ff] blur-3xl" />
      <div className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-full border border-[#e6e6e0] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#676762] shadow-sm">
        <span className="size-1.5 rounded-full bg-[#35a853]" />
        Open source PR reviews for teams who ship
      </div>

      <h1 className="relative z-10 mx-auto mt-8 max-w-[920px] font-pixel text-[clamp(3.5rem,8.5vw,7.25rem)] leading-[0.9] tracking-[-0.075em] text-[#171717]">
        Merge with
        <br />
        <span className="text-[#2764d8]">confidence.</span>
      </h1>
      <p className="mx-auto mt-8 max-w-[600px] text-[17px] leading-7 text-[#686864] sm:text-[19px]">
        OpenMerge reads every pull request with focused AI agents, explains what matters, and leaves your team with a clear path to merge.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="https://github.com/apps/openmerge-app/installations/select_target"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#171717] px-6 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2a2a2a]"
        >
          Install on GitHub
          <span className="transition-transform group-hover:translate-x-0.5">↗</span>
        </a>
        <Link
          href="#how-it-works"
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#deded8] bg-white px-6 text-[14px] font-semibold text-[#33332f] transition-colors hover:border-[#bdbdb6] hover:bg-[#fafaf7]"
        >
          See how it works
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-[980px] rounded-[26px] border border-[#e5e5df] bg-[#f7f7f3] p-2.5 text-left shadow-[0_24px_70px_rgba(27,27,23,0.09)] sm:mt-20 sm:p-3">
        <div className="flex items-center justify-between border-b border-[#e7e7e1] px-3 pb-3 text-[11px] font-medium text-[#8a8a84] sm:px-5">
          <span className="flex items-center gap-2 text-[#30302c]"><span className="size-2 rounded-full bg-[#2a2a28]" />OpenMerge review</span>
          <span>pull/482 · latest commit</span>
        </div>
        <div className="grid gap-3 p-1 pt-3 md:grid-cols-3">
          <ReviewCard tone="blue" eyebrow="Step 01" title="Reading your diff">
            <MiniRow color="#4b8ff7">Code quality agent running</MiniRow>
            <MiniRow color="#4b8ff7">Security agent running</MiniRow>
            <MiniRow color="#4b8ff7">Performance agent running</MiniRow>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf2fa]"><div className="h-full w-2/3 rounded-full bg-[#4b8ff7]" /></div>
          </ReviewCard>
          <ReviewCard tone="orange" eyebrow="Step 02" title="Findings with context">
            <MiniRow color="#f18b2c">8 issues found</MiniRow>
            <MiniRow color="#f18b2c">7 blocking · 1 suggestion</MiniRow>
            <div className="mt-3 rounded-xl border border-[#f1e4cf] bg-[#fffaf1] p-3 text-[12px] leading-5 text-[#8a6b47]">“This callback can be reached before the workflow is verified.”</div>
          </ReviewCard>
          <ReviewCard tone="green" eyebrow="Step 03" title="Ready to merge">
            <MiniRow color="#36a653">No blocking issues</MiniRow>
            <MiniRow color="#36a653">Summary posted to the PR</MiniRow>
            <MiniRow color="#36a653">Review history saved</MiniRow>
            <div className="mt-3 inline-flex rounded-full bg-[#dff4df] px-3 py-1.5 text-[12px] font-semibold text-[#278040]">Looks good to merge</div>
          </ReviewCard>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-[#8a8a84]">
        <span>GitHub-native</span><span className="size-1 rounded-full bg-[#c8c8c1]" /><span>Multi-agent</span><span className="size-1 rounded-full bg-[#c8c8c1]" /><span>BYOK-ready</span>
      </div>
    </section>
  );
}
