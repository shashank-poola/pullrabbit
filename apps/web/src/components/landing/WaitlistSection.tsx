import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export function WaitlistSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="relative overflow-hidden rounded-[28px] bg-[#171717] px-7 py-16 text-center text-white sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-16 -top-24 size-64 rounded-full bg-[#2e6cf6]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 size-72 rounded-full bg-[#ff9b55]/25 blur-3xl" />
        <div className="relative mx-auto max-w-[640px]">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#aebfe6]">Start with your next pull request</p>
          <h2 className="font-pixel text-4xl leading-[1.08] tracking-[-0.04em] sm:text-5xl">Make review feel lighter.</h2>
          <p className="mx-auto mt-5 max-w-[470px] text-[16px] leading-7 text-[#c5c5c5]">Install OpenMerge, connect GitHub, and give every change the context it deserves.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><a href="https://github.com/apps/openmerge-app/installations/select_target" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-[#171717] transition-transform hover:-translate-y-0.5">Install on GitHub <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden="true" /></a><Link href="/docs" className="rounded-full border border-white/25 px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/10">Read the docs</Link></div>
        </div>
      </div>
    </section>
  );
}
