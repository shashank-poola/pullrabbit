import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export function InstallCtaSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="relative overflow-hidden rounded-[24px] border border-[#d8d8d4] bg-[#087fc9] px-7 py-16 text-center text-white shadow-[0_20px_50px_rgba(8,127,201,0.16)] sm:px-12 sm:py-20">
        <div className="absolute inset-0 bg-[url('/openmerge/footerabove.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-[#087fc9]/45" />
        <div className="relative mx-auto max-w-[640px]">
          <h2 className="font-pixel text-4xl leading-[1.08] tracking-[-0.04em] sm:text-5xl">Make review feel lighter.</h2>
          <p className="mx-auto mt-5 max-w-[470px] text-[16px] leading-7 text-white/85">A clear review for every pull request.</p>
          <div className="mt-8 flex justify-center"><a href="https://github.com/apps/openmerge-app/installations/select_target" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-[#171717] transition-transform hover:-translate-y-0.5">Install on GitHub <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  );
}
