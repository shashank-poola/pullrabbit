"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  BookOpen01Icon,
  DashboardSquare01Icon,
  FolderGitIcon,
  GitForkIcon,
  Logout01Icon,
  Settings01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { DashboardIcon } from "./DashboardPrimitives";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: DashboardSquare01Icon, exact: true },
  { href: "/dashboard/reviews", label: "Reviews", icon: Task01Icon },
  { href: "/dashboard/repositories", label: "Repositories", icon: FolderGitIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings01Icon },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!window.localStorage.getItem("pr_token")) {
      router.replace("/");
    }
  }, [router]);

  function signOut() {
    window.localStorage.removeItem("pr_token");
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-[#20201e]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[238px] border-r border-[#e5e5df] bg-white px-4 py-5 lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-3 px-2" aria-label="OpenMerge dashboard">
          <Image src="/companies/openmerge.png" alt="" width={36} height={36} className="size-9 rounded-[11px] object-cover" priority />
          <span className="text-[17px] font-semibold tracking-[-0.04em]">OpenMerge</span>
        </Link>

        <p className="mt-10 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b9b94]">Workspace</p>
        <nav className="mt-3 space-y-1" aria-label="Dashboard navigation">
          {navigation.map(({ href, label, icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors",
                  active ? "bg-[#edf3ff] text-[#2764d8]" : "text-[#676762] hover:bg-[#f5f5f2] hover:text-[#292925]"
                )}
              >
                <DashboardIcon icon={icon} size={16} strokeWidth={active ? 2.1 : 1.8} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-[#eeeeea] pt-4">
          <Link href="/docs" className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-[#676762] transition-colors hover:bg-[#f5f5f2] hover:text-[#292925]">
            <DashboardIcon icon={BookOpen01Icon} size={16} aria-hidden="true" />
            Documentation
          </Link>
          <button onClick={signOut} type="button" className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium text-[#676762] transition-colors hover:bg-[#fff0f0] hover:text-[#bd3737]">
            <DashboardIcon icon={Logout01Icon} size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[238px]">
        <header className="sticky top-0 z-10 border-b border-[#e5e5df] bg-[#fbfbf9]/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 lg:hidden" aria-label="OpenMerge dashboard">
              <Image src="/companies/openmerge.png" alt="" width={32} height={32} className="size-8 rounded-[10px] object-cover" priority />
              <span className="text-[15px] font-semibold tracking-[-0.04em]">OpenMerge</span>
            </Link>
            <p className="hidden text-[13px] font-medium text-[#777771] lg:block">Your GitHub review workspace</p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/apps/openmerge-app/installations/select_target"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-full border border-[#ddddD7] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#40403c] transition-colors hover:border-[#bdbdb7] hover:bg-[#f7f7f4] sm:inline-flex"
              >
                <DashboardIcon icon={GitForkIcon} size={14} aria-hidden="true" />
                Add repositories
              </a>
              <button onClick={signOut} type="button" className="grid size-9 place-items-center rounded-full bg-[#20201e] text-[11px] font-bold text-white transition-transform hover:-translate-y-0.5" aria-label="Sign out">
                OM
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5 lg:hidden" aria-label="Dashboard navigation">
            {navigation.map(({ href, label, icon, exact }) => {
              const active = isActive(pathname, href, exact);
              return (
                <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold", active ? "bg-[#20201e] text-white" : "text-[#777771] hover:bg-[#efefeb]")}>
                  <DashboardIcon icon={icon} size={14} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-[1420px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
