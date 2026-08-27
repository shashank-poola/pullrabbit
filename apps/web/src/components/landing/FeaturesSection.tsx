import Image from "next/image";

const providers = [
  { name: "Gemini", file: "gemini.webp" },
  { name: "Claude", file: "claude.webp" },
  { name: "ChatGPT", file: "chatgpt.png" },
  { name: "Grok", file: "grok.webp" },
  { name: "Z.ai", file: "zai.webp" },
];

export function FeaturesSection() {
  return (
    <section id="byok" className="scroll-mt-20 border-y border-[#eeeeee] bg-[#fbfbfb]">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:py-32">
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Bring your own key</p>
          <h2 className="font-pixel max-w-[520px] text-4xl leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-5xl">Your provider. Your key. Your control.</h2>
          <p className="mt-6 max-w-[500px] text-[16px] leading-7 text-[#656565]">Choose the model that fits your codebase and keep your usage in your own account. OpenMerge brings the review workflow. You bring the key.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Private by default", "OpenAI-compatible", "Usage stays yours"].map((label) => <span key={label} className="rounded-full border border-[#dfdfdf] bg-white px-3.5 py-2 text-[12px] font-medium text-[#555]">{label}</span>)}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e8e8e8] bg-white p-4 shadow-[0_16px_45px_rgba(23,23,23,0.06)] sm:p-6">
          <div className="rounded-[20px] bg-[#f6f6f4] p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7a7a7a]">Review provider</p><p className="mt-2 text-[18px] font-semibold text-[#171717]">Select your model</p></div>
              <span className="rounded-full bg-[#e7f7ed] px-3 py-1.5 text-[11px] font-semibold text-[#198b4d]">BYOK ready</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {providers.map((provider, index) => <div key={provider.name} className={`flex items-center gap-2 rounded-xl border px-3 py-3 ${index === 0 ? "border-[#b8d9ff] bg-white shadow-[0_3px_10px_rgba(46,108,246,0.08)]" : "border-[#e6e6e6] bg-white/70"}`}><Image src={`/companies/${provider.file}`} alt="" width={24} height={24} className="size-6 object-contain" /><span className="text-[12px] font-medium text-[#343434]">{provider.name}</span></div>)}
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#d1d1d1] px-3 py-3"><span className="grid size-6 place-items-center rounded-full bg-[#e9e9e9] text-[16px] text-[#777]">+</span><span className="text-[12px] font-medium text-[#777]">Custom</span></div>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-[#e5e5e5] pt-5 text-[12px] text-[#717171]"><span className="grid size-6 place-items-center rounded-full bg-[#dff4e7] text-[#198b4d]">✓</span> Keys are stored in your environment, not in the review comment.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
