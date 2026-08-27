"use client";

import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const faqs = [
  ["What is OpenMerge?", "OpenMerge is an open source GitHub App that reviews pull requests with specialized AI agents and posts useful context directly on the changed lines."],
  ["How does a review start?", "Install the app, select your repositories, and open a pull request. OpenMerge listens for the GitHub event and starts the review automatically."],
  ["Which providers can I use?", "OpenMerge is designed for your provider and your key. Gemini, Groq, and OpenAI-compatible endpoints can be configured as your setup evolves."],
  ["Does OpenMerge change my code?", "No. It reads the pull request, writes review feedback, and leaves the decision and the code changes with your team."],
  ["Where are review comments posted?", "The summary appears in the pull request conversation and findings are posted inline on the relevant changed lines."],
  ["Is OpenMerge open source?", "Yes. The project is open source on GitHub, so you can inspect the workflow and adapt it to your team."],
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-[#eeeeee] bg-[#fbfbfb]">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:px-10 lg:py-32">
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">FAQ</p>
          <h2 className="font-pixel max-w-[420px] text-4xl leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-5xl">Everything you are wondering.</h2>
          <p className="mt-6 max-w-[330px] text-[15px] leading-7 text-[#686868]">
            Still curious? <a href="https://github.com/shashank-poola/openmerge/issues" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#2e6cf6] underline decoration-[#b9d0ff] underline-offset-4">Ask on GitHub <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} aria-hidden="true" /></a>.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
              <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-medium text-[#202020] sm:px-6">
                <span>{question}</span>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border border-[#d9d9d9] text-[#898989] transition-transform duration-200 ${open === index ? "rotate-180" : "rotate-0"}`}>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={1.8} aria-hidden="true" />
                </span>
              </button>
              {open === index && <p className="border-t border-[#eeeeee] bg-[#fafafa] px-5 pb-5 pt-4 text-[14px] leading-6 text-[#686868] sm:px-6">{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
