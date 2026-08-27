const rows = [
  ["GitHub-native review comments", true, "Sometimes", "No"],
  ["Security, performance, and quality agents", true, "Varies", "No"],
  ["Bring your own model key", true, "Varies", "Not applicable"],
  ["Open source and self-hostable", true, "Varies", "Not applicable"],
  ["A review summary your team can scan", true, "Varies", "No"],
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-[#159447]" aria-label="Yes">✓</span>;
  if (value === "No") return <span className="text-[#b1b1b1]" aria-label="No">−</span>;
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

      <div className="overflow-x-auto rounded-[22px] border border-[#e5e5e5] bg-white shadow-[0_8px_30px_rgba(23,23,23,0.035)]">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead><tr className="border-b border-[#e9e9e9] text-[13px] text-[#777]"><th className="px-6 py-5 font-medium">Review capability</th><th className="bg-[#f7fbff] px-5 py-5 text-center font-semibold text-[#2e6cf6]">OpenMerge</th><th className="px-5 py-5 text-center font-medium">Other reviewers</th><th className="px-5 py-5 text-center font-medium">Manual review</th></tr></thead>
          <tbody>{rows.map(([label, openMerge, other, manual]) => <tr key={label as string} className="border-b border-[#eeeeee] last:border-0"><th className="px-6 py-5 text-[13px] font-medium text-[#333]">{label}</th><td className="bg-[#f7fbff] px-5 py-5 text-center text-[18px]"><Cell value={openMerge} /></td><td className="px-5 py-5 text-center"><Cell value={other} /></td><td className="px-5 py-5 text-center"><Cell value={manual} /></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
