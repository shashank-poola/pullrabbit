import Image from "next/image";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const rows = [
  ["Posts findings on changed lines", true, "Depends", false],
  ["Specialized security, performance, and quality passes", true, true, "Depends"],
  ["Bring your own model key", true, "Depends", "Not applicable"],
  ["Open source workflow", true, "Depends", "Not applicable"],
  ["A concise review summary in the pull request", true, true, false],
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} strokeWidth={1.8} className="mx-auto text-[#159447]" aria-label="Yes" />;
  if (value === false) return <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} className="mx-auto text-[#d45b5b]" aria-label="No" />;
  return <span className="text-[12px] text-[#777]">{value}</span>;
}

export function CompetitorsSection() {
  return (
    <section id="compare" className="scroll-mt-20 mx-auto max-w-[1180px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto mb-12 max-w-[620px] text-center">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Built for the way teams merge</p>
        <h2 className="font-pixel text-4xl leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-5xl">Why OpenMerge?</h2>
        <p className="mt-5 text-[16px] leading-7 text-[#656565]">A focused review layer that fits into the tools your team already uses.</p>
      </div>

      <div className="overflow-x-auto rounded-[22px] border border-[#e1e1de] bg-white shadow-[0_10px_35px_rgba(23,23,23,0.035)]">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead><tr className="border-b border-[#e9e9e9] text-[13px] text-[#777]"><th className="px-6 py-5 font-medium">Native features</th><th className="bg-[#f7fbff] px-5 py-5 text-center font-semibold text-[#2e6cf6]"><span className="inline-flex items-center gap-2"><Image src="/companies/openmerge.png" alt="" width={22} height={22} className="size-[22px] rounded-md object-cover" />OpenMerge</span></th><th className="px-5 py-5 text-center font-medium">Other AI reviewers</th><th className="px-5 py-5 text-center font-medium">Manual review</th></tr></thead>
          <tbody>{rows.map(([label, openMerge, other, manual]) => <tr key={label as string} className="border-b border-[#eeeeee] last:border-0"><th className="px-6 py-5 text-[13px] font-medium text-[#333]">{label}</th><td className="bg-[#f7fbff] px-5 py-5 text-center text-[18px]"><Cell value={openMerge} /></td><td className="px-5 py-5 text-center"><Cell value={other} /></td><td className="px-5 py-5 text-center"><Cell value={manual} /></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
