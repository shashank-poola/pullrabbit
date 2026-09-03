"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen01Icon, ExternalLinkIcon, GitBranchIcon, Logout01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { getDashboard } from "@/lib/api";
import type { DashboardResponse } from "@/types/dashboard";
import { DashboardIcon, DashboardLoading, EmptyPanel } from "./DashboardPrimitives";

export function SettingsScreen() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const nextData = await getDashboard();
      setData(nextData);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load workspace settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  function signOut() {
    window.localStorage.removeItem("pr_token");
    router.replace("/");
  }

  if (loading && !data) {
    return <DashboardLoading label="Loading workspace settings" />;
  }

  if (error && !data) {
    return <EmptyPanel title="Settings are unavailable" description="Check that the OpenMerge API is running, then try again." action={<button onClick={() => void loadDashboard()} type="button" className="rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white">Try again</button>} />;
  }

  return (
    <div className="max-w-4xl space-y-7">
      <section>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2764d8]">Workspace settings</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.06em] text-[#20201e] sm:text-[38px]">Your OpenMerge connection.</h1>
        <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#73736e]">Manage GitHub App access and find the essentials for your review workspace.</p>
      </section>

      {error ? <div className="rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">Showing your last loaded settings. Refresh failed: {error}</div> : null}

      <section className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
        <div className="border-b border-[#ecece7] px-5 py-4 sm:px-6"><h2 className="text-[15px] font-semibold tracking-[-0.025em]">Connected GitHub accounts</h2><p className="mt-1 text-[12px] text-[#83837d]">OpenMerge can only review repositories granted through a GitHub App installation.</p></div>
        {data?.installations.length ? (
          <div className="divide-y divide-[#efefeb]">
            {data.installations.map((installation) => (
              <div key={installation.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#edf3ff] text-[#2764d8]"><DashboardIcon icon={GitBranchIcon} size={19} aria-hidden="true" /></span><div><p className="text-[13px] font-semibold text-[#33332f]">{installation.githubAccountLogin}</p><p className="mt-1 text-[12px] text-[#85857f]">{installation.githubAccountType} account · {installation.repositories.length} active {installation.repositories.length === 1 ? "repository" : "repositories"}</p></div></div>
                <a href="https://github.com/settings/installations" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 self-start rounded-full border border-[#ddddD7] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#4b4b46] transition-colors hover:border-[#bfbfb8] hover:bg-[#f7f7f4] sm:self-auto">Manage on GitHub <DashboardIcon icon={ExternalLinkIcon} size={14} aria-hidden="true" /></a>
              </div>
            ))}
          </div>
        ) : <div className="px-6 py-12 text-center text-[13px] text-[#777771]">No GitHub App installations are connected yet.</div>}
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)]"><span className="grid size-10 place-items-center rounded-xl bg-[#edf9f1] text-[#198b4d]"><DashboardIcon icon={Shield01Icon} size={19} aria-hidden="true" /></span><h2 className="mt-5 text-[15px] font-semibold tracking-[-0.025em]">Repository access</h2><p className="mt-2 text-[13px] leading-6 text-[#74746f]">Repository selection and GitHub App permissions are managed securely in GitHub. Sync OpenMerge after you change access.</p><Link href="/dashboard/repositories" className="mt-5 inline-flex text-[12px] font-semibold text-[#2764d8] hover:text-[#174cae]">Manage repositories →</Link></div>
        <div className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)]"><span className="grid size-10 place-items-center rounded-xl bg-[#fff5e9] text-[#b65b07]"><DashboardIcon icon={BookOpen01Icon} size={19} aria-hidden="true" /></span><h2 className="mt-5 text-[15px] font-semibold tracking-[-0.025em]">Need help?</h2><p className="mt-2 text-[13px] leading-6 text-[#74746f]">Read the setup guide to understand how installations, webhooks, and automatic reviews work.</p><Link href="/docs" className="mt-5 inline-flex text-[12px] font-semibold text-[#2764d8] hover:text-[#174cae]">Open documentation →</Link></div>
      </section>

      <section className="rounded-2xl border border-[#f0dddd] bg-[#fffafa] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-[14px] font-semibold text-[#4d3434]">Sign out of this browser</h2><p className="mt-1 text-[12px] leading-5 text-[#8e6666]">This removes the local OpenMerge session from this device. It does not uninstall the GitHub App.</p></div>
        <button onClick={signOut} type="button" className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-[#eacccc] bg-white px-3.5 text-[12px] font-semibold text-[#a23c3c] transition-colors hover:bg-[#fff1f1] sm:mt-0"><DashboardIcon icon={Logout01Icon} size={14} aria-hidden="true" />Sign out</button>
      </section>
    </div>
  );
}
