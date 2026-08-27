import Image from "next/image";
import Link from "next/link";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1000px] flex-col border-x border-[#e9e9e6]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#ecece8] px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="OpenMerge home">
            <Image src="/companies/openmerge.png" alt="" width={36} height={36} className="size-9 rounded-[11px] object-cover" priority />
            <span className="text-[17px] font-semibold tracking-[-0.04em]">OpenMerge</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6f6f6b] transition-colors hover:text-[#171717]">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={1.8} aria-hidden="true" />
            Back home
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8 sm:py-20">{children}</main>
        <footer className="border-t border-[#eeeeeb] px-5 py-5 text-[12px] text-[#969696] sm:px-8">Open source, built in public.</footer>
      </div>
    </div>
  );
}
