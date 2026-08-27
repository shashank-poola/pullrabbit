import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, ArrowUpRight01Icon, BotIcon, FlowConnectionIcon } from "@hugeicons/core-free-icons";

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Install the app and choose the repositories you want reviewed.",
    tone: "bg-[#e8f0ff]",
    accent: "text-[#2e6cf6]",
    preview: (
      <div className="space-y-3 rounded-2xl border border-[#dbe5ff] bg-white p-5 shadow-[0_12px_35px_rgba(48,94,190,0.10)]">
        <div className="flex items-center justify-between gap-2 text-[12px] text-[#202020]">
          <div className="flex items-center gap-2 font-semibold">
            <Image src="/companies/openmerge.png" alt="" width={28} height={28} className="size-7 rounded-lg object-cover" />
            <span><span className="block">OpenMerge</span><span className="block text-[10px] font-normal text-[#80838b]">GitHub App</span></span>
          </div>
          <span className="rounded-full bg-[#e8f7ed] px-2 py-1 text-[10px] font-medium text-[#278040]">Connected</span>
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
      <div className="relative h-[210px] overflow-hidden rounded-2xl border border-[#ffe2c1] bg-white p-4 shadow-[0_12px_35px_rgba(195,108,24,0.10)]">
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#ffe2c1] bg-[#fffaf5] px-3 py-2 text-[11px] font-semibold text-[#343434] shadow-sm">
          <span className="grid size-6 place-items-center rounded-lg bg-[#ffe1c4] text-[#d7650e]"><HugeiconsIcon icon={FlowConnectionIcon} size={14} strokeWidth={1.8} aria-hidden="true" /></span>
          Orchestrator
        </div>
        <div className="absolute left-1/2 top-[54px] h-7 border-l border-dashed border-[#f1a86b]" />
        <div className="absolute left-[16.6667%] right-[16.6667%] top-[81px] border-t border-dashed border-[#f1a86b]" />
        <div className="absolute left-[16.6667%] top-[81px] h-5 border-l border-dashed border-[#f1a86b]" />
        <div className="absolute left-1/2 top-[81px] h-5 border-l border-dashed border-[#f1a86b]" />
        <div className="absolute right-[16.6667%] top-[81px] h-5 border-l border-dashed border-[#f1a86b]" />
        <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2">
          {["Quality", "Security", "Performance"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-xl bg-[#fffaf5] px-2 py-2.5 text-center text-[10px] text-[#525866]">
              <span className="grid size-6 place-items-center rounded-md bg-[#fff0df] text-[#e57620]"><HugeiconsIcon icon={BotIcon} size={13} strokeWidth={1.8} aria-hidden="true" /></span>
              <span>{label}</span>
              <span className="size-1.5 rounded-full bg-[#e57620]" />
            </div>
          ))}
        </div>
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
      <div className="space-y-4 rounded-2xl border border-[#d2eedc] bg-white p-5 shadow-[0_12px_35px_rgba(28,135,78,0.10)]">
        <div className="flex items-center justify-between border-b border-[#e8ece9] pb-4 text-[11px] text-[#525866]">
          <span className="flex items-center gap-2"><Image src="/companies/openmerge.png" alt="" width={22} height={22} className="size-[22px] rounded-md object-cover" />OpenMerge review</span>
          <span>PR #42</span>
        </div>
        <div className="space-y-2.5 text-[11px] text-[#525866]">
          <div className="flex items-center gap-2"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={1.8} className="text-[#199653]" aria-hidden="true" />No blocking findings</div>
          <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#199653]" />Summary posted to the PR</div>
          <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#199653]" />Review history saved</div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#cfe8d7] bg-[#f2fbf4] px-3 py-2.5 text-[11px] font-medium text-[#199653]">
          Looks good to merge
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden="true" />
        </div>
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
          <article key={step.number} className="overflow-hidden rounded-[24px] border border-[#e3e3df] bg-white shadow-[0_10px_34px_rgba(23,23,23,0.055)]">
            <div className={`m-3 flex min-h-[260px] items-center justify-center rounded-[18px] border border-white p-6 ${step.tone}`}>
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
