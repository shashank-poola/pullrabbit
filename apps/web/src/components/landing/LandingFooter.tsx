import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/shashank-poola/openmerge" },
  { label: "Docs", href: "/docs" },
  { label: "Install", href: "https://github.com/apps/openmerge-app/installations/select_target" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#e9e9e6] bg-white">
      <div className="flex flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[#171717]">
              <Image src="/companies/openmerge.png" alt="" width={32} height={32} className="size-8 rounded-[10px] object-cover" />
              OpenMerge
            </Link>
            <p className="mt-3 max-w-[250px] text-[13px] leading-6 text-[#777]">Clearer pull request reviews for teams that ship.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[#696969]" aria-label="Footer navigation">
            {footerLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="transition-colors hover:text-[#171717]">{link.label}</a>)}
            <Link href="/privacy" className="transition-colors hover:text-[#171717]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#171717]">Terms</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-[#eeeeeb] pt-5 text-[12px] text-[#969696] sm:flex-row sm:items-center sm:justify-between">
          <p>Open source, built in public.</p>
          <p>© {new Date().getFullYear()} OpenMerge</p>
        </div>
      </div>
    </footer>
  );
}
