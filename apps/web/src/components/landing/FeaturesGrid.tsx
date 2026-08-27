const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Install the app and choose the repositories you want reviewed.",
    tone: "bg-[#e8f0ff]",
    accent: "text-[#2e6cf6]",
    preview: (
      <div className="space-y-3 rounded-2xl border border-[#dbe5ff] bg-white p-5 shadow-[0_12px_35px_rgba(48,94,190,0.10)]">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#202020]">
          <span className="grid size-7 place-items-center rounded-lg bg-[#202020] text-[10px] text-white">OM</span>
          OpenMerge
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#f6f8fc] px-3 py-2.5 text-[11px] text-[#525866]">
          <span>Repositories</span>
          <span className="rounded-full bg-[#dce7ff] px-2 py-1 font-medium text-[#2e6cf6]">3 selected</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#525866]"><span className="size-2 rounded-full bg-[#31b36b]" /> GitHub connected</div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Every diff gets a second set of eyes",
    description: "Security, performance, and code quality agents read the same change in parallel.",
    tone: "bg-[#fff1df]",
    accent: "text-[#e57620]",
    preview: (
      <div className="space-y-2 rounded-2xl border border-[#ffe2c1] bg-white p-5 shadow-[0_12px_35px_rgba(195,108,24,0.10)]">
        {["Code quality", "Security", "Performance"].map((label, index) => (
          <div key={label} className="flex items-center gap-3 rounded-xl bg-[#fffaf5] px-3 py-2.5 text-[11px] text-[#525866]">
            <span className={`grid size-6 place-items-center rounded-md ${index === 1 ? "bg-[#ffe1c4] text-[#d7650e]" : "bg-[#fff0df] text-[#e57620]"}`}>{index + 1}</span>
            <span className="flex-1">{label}</span>
            <span className="size-1.5 rounded-full bg-[#e57620]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    title: "Review, fix, merge",
    description: "Findings land on the lines that changed, with enough context to act on them quickly.",
    tone: "bg-[#eaf8ee]",
    accent: "text-[#199653]",
    preview: (
      <div className="space-y-3 rounded-2xl border border-[#d2eedc] bg-white p-5 shadow-[0_12px_35px_rgba(28,135,78,0.10)]">
        <div className="flex items-center justify-between text-[11px] text-[#525866]"><span>Pull request #42</span><span className="rounded-full bg-[#dcf5e5] px-2 py-1 font-medium text-[#199653]">Ready to merge</span></div>
        <div className="rounded-xl border border-[#e8ece9] p-3"><div className="mb-2 h-2 w-3/4 rounded-full bg-[#dfe9e2]" /><div className="h-2 w-1/2 rounded-full bg-[#edf2ee]" /><div className="mt-3 flex items-center gap-2 text-[11px] text-[#199653]"><span className="grid size-5 place-items-center rounded-full bg-[#dcf5e5]">✓</span> 0 blocking findings</div></div>
      </div>
    ),
  },
];

export function FeaturesGrid() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1180px] scroll-mt-20 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto mb-14 max-w-[620px] text-center">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">How it works</p>
        <h2 className="font-pixel text-4xl leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-5xl">A calmer path to merge.</h2>
        <p className="mx-auto mt-5 max-w-[500px] text-[16px] leading-7 text-[#656565]">OpenMerge turns a noisy pull request into a short, useful conversation with your team.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.number} className="overflow-hidden rounded-[26px] border border-[#ececec] bg-white shadow-[0_8px_34px_rgba(23,23,23,0.045)]">
            <div className={`m-3 flex min-h-[260px] items-center justify-center rounded-[19px] p-6 ${step.tone}`}>
              <div className="w-full max-w-[290px]">{step.preview}</div>
            </div>
            <div className="px-7 pb-8 pt-3">
              <div className={`mb-3 text-[12px] font-semibold ${step.accent}`}>{step.number}</div>
              <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#171717]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-6 text-[#686868]">{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
