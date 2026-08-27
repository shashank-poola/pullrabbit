import Image from "next/image";

const reviewStories = [
  {
    number: "01",
    title: "The review starts in context.",
    description: "A lightweight status note appears in the pull request while OpenMerge reads the latest changes.",
    image: "/reviews/first.jpg",
    alt: "OpenMerge review in progress on a GitHub pull request",
  },
  {
    number: "02",
    title: "Findings your team can act on.",
    description: "The summary gives every issue a severity, file, and line so fixes stay close to the diff.",
    image: "/reviews/second.jpg",
    alt: "OpenMerge summary with actionable pull request findings",
  },
  {
    number: "03",
    title: "A clear answer at the end.",
    description: "When the pass is clean, OpenMerge leaves a concise merge-ready summary in the thread.",
    image: "/reviews/third.jpg",
    alt: "OpenMerge merge-ready pull request summary",
  },
];

export function ReviewShowcase() {
  return (
    <section id="review-showcase" className="scroll-mt-20 border-y border-[#eeeeeb] bg-white">
      <div className="mx-auto max-w-[1000px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto mb-20 max-w-[620px] text-center">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Inside a review</p>
          <h2 className="font-pixel text-4xl leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-5xl">From first signal to merge.</h2>
          <p className="mx-auto mt-5 max-w-[500px] text-[16px] leading-7 text-[#656565]">The whole review stays in the pull request, from the first status update to the final answer.</p>
        </div>
        <div className="mx-auto mb-20 h-px w-2/3 max-w-[620px] bg-[#e8e8e4] sm:mb-24" aria-hidden="true" />

        <div>
          {reviewStories.map((story, index) => (
            <article key={story.number} className={`${index > 0 ? "border-t border-[#eeeeeb] pt-20 sm:pt-24" : ""} ${index < reviewStories.length - 1 ? "pb-20 sm:pb-24" : ""}`}>
              <div className="mx-auto mb-9 max-w-[620px] text-center">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#737373]">{story.number} / OpenMerge review</p>
                <h3 className="font-pixel text-3xl leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl">{story.title}</h3>
                <p className="mx-auto mt-4 max-w-[530px] text-[15px] leading-7 text-[#686868]">{story.description}</p>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-[#dededb] bg-[#f3f4f3] shadow-[0_18px_45px_rgba(23,23,23,0.08)]">
                <Image src={story.image} alt={story.alt} width={2048} height={1152} className="h-auto w-full" sizes="(max-width: 1000px) 100vw, 900px" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
