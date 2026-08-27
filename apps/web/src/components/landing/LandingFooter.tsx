import Link from "next/link";
import { OpenMergeMark } from "./brand/OpenMergeMark";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/shashank-poola/openmerge" },
  { label: "Docs", href: "/docs" },
  { label: "Install", href: "https://github.com/apps/openmerge-app/installations/select_target" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#eeeeee] bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-7 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[#171717]"><span className="grid size-8 place-items-center rounded-[10px] bg-[#171717]"><OpenMergeMark color="light" /></span>OpenMerge</Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[#696969]">{footerLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="transition-colors hover:text-[#171717]">{link.label}</a>)}<Link href="/privacy" className="transition-colors hover:text-[#171717]">Privacy</Link><Link href="/terms" className="transition-colors hover:text-[#171717]">Terms</Link></nav>
        <p className="text-[12px] text-[#969696]">Open source, built in public.</p>
      </div>
    </footer>
  );
}
