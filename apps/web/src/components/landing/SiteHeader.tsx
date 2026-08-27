import Link from "next/link";
import { OpenMergeMark } from "./brand/OpenMergeMark";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "BYOK", href: "#byok" },
  { label: "Compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  return (
    <header className="border-b border-[#ecece8] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="OpenMerge home">
          <span className="grid size-9 place-items-center rounded-[11px] bg-[#171717]">
            <OpenMergeMark color="light" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#171717]">OpenMerge</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-[#686864] transition-colors hover:text-[#171717]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/shashank-poola/openmerge"
            target="_blank"
            rel="noreferrer"
            className="text-[14px] font-medium text-[#686864] transition-colors hover:text-[#171717]"
          >
            GitHub
          </a>
          <a
            href={`${apiUrl}/api/v1/auth/github`}
            className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Install app
            <span className="text-[15px] transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </nav>

        <a
          href={`${apiUrl}/api/v1/auth/github`}
          className="rounded-full bg-[#171717] px-4 py-2 text-[13px] font-semibold text-white md:hidden"
        >
          Get started
        </a>
      </div>
    </header>
  );
}
