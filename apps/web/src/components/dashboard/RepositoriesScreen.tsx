"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight01Icon,
  CheckIcon,
  GitBranchIcon,
  GitForkIcon,
  LockKeyIcon,
  Refresh01Icon,
  Shield01Icon,
  ToggleLeftIcon,
} from "@hugeicons/core-free-icons";
import { getDashboard, setRepositoryAutoReview, syncInstallation } from "@/lib/api";
import type { DashboardResponse } from "@/types/dashboard";
import { DashboardIcon, DashboardLoading, EmptyPanel } from "./DashboardPrimitives";

export function RepositoriesScreen() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingInstallationId, setSyncingInstallationId] = useState<string | null>(null);
  const [updatingRepositoryId, setUpdatingRepositoryId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const nextData = await getDashboard();
      setData(nextData);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function toggleAutoReview(repoId: string, enabled: boolean) {
    setUpdatingRepositoryId(repoId);
    setActionError(null);

    try {
      const result = await setRepositoryAutoReview(repoId, enabled);
      setData((current) => {
        if (!current) return current;

        return {
          ...current,
          installations: current.installations.map((installation) => ({
            ...installation,
            repositories: installation.repositories.map((repository) =>
              repository.id === repoId ? { ...repository, ...result.repo, recentReviews: repository.recentReviews } : repository
            ),
          })),
        };
      });
    } catch (updateError) {
      setActionError(updateError instanceof Error ? updateError.message : "Could not update repository settings.");
    } finally {
      setUpdatingRepositoryId(null);
    }
  }

  async function syncRepositories(installationId: string) {
    setSyncingInstallationId(installationId);
    setActionError(null);

    try {
      await syncInstallation(installationId);
      await loadDashboard();
    } catch (syncError) {
      setActionError(syncError instanceof Error ? syncError.message : "Could not synchronize repositories from GitHub.");
    } finally {
      setSyncingInstallationId(null);
    }
  }

  if (loading && !data) {
    return <DashboardLoading label="Loading connected repositories" />;
  }

  if (error && !data) {
    return (
      <EmptyPanel
        title="Repositories are unavailable"
        description={error === "UNAUTHORIZED" ? "Your session has expired. Sign in with GitHub again to manage repositories." : "Check that the OpenMerge API is running, then try again."}
        action={<button onClick={() => void loadDashboard()} type="button" className="rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white">Try again</button>}
      />
    );
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2764d8]">Repository controls</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.06em] text-[#20201e] sm:text-[38px]">Choose where OpenMerge reviews.</h1>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#73736e]">Turn automatic review on or off per repository, then sync when your GitHub App access changes.</p>
        </div>
        <a href="https://github.com/apps/openmerge-app/installations/select_target" target="_blank" rel="noreferrer" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#20201e] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#343430]">
          <DashboardIcon icon={GitBranchIcon} size={14} aria-hidden="true" />
          Add repositories
        </a>
      </section>

      {actionError ? <div className="rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">{actionError}</div> : null}
      {error ? <div className="rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">Showing your last loaded repositories. Refresh failed: {error}</div> : null}

      {data?.installations.length ? (
        <div className="space-y-5">
          {data.installations.map((installation) => (
            <section key={installation.id} className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
              <div className="flex flex-col gap-4 border-b border-[#ecece7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#edf3ff] text-[#2764d8]"><DashboardIcon icon={GitBranchIcon} size={19} aria-hidden="true" /></span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-semibold tracking-[-0.025em] text-[#30302c]">{installation.githubAccountLogin}</h2>
                      <span className="rounded-full border border-[#c6ead4] bg-[#edf9f1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#167541]">{installation.status.toLowerCase()}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#85857f]">{installation.githubAccountType} account · {installation.repositories.length} connected {installation.repositories.length === 1 ? "repository" : "repositories"}</p>
                  </div>
                </div>
                <button onClick={() => void syncRepositories(installation.id)} type="button" disabled={syncingInstallationId === installation.id} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-full border border-[#ddddD7] bg-white px-3.5 text-[12px] font-semibold text-[#4b4b46] transition-colors hover:border-[#bfbfb8] hover:bg-[#f7f7f4] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto">
                  <DashboardIcon icon={Refresh01Icon} size={14} className={syncingInstallationId === installation.id ? "animate-spin" : undefined} aria-hidden="true" />
                  Sync GitHub
                </button>
              </div>

              {installation.repositories.length ? (
                <div className="divide-y divide-[#efefeb]">
                  {installation.repositories.map((repository) => {
                    const isUpdating = updatingRepositoryId === repository.id;
                    return (
                      <article key={repository.id} className="grid gap-4 px-5 py-4 transition-colors hover:bg-[#fcfcfa] md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:px-6">
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <DashboardIcon icon={GitForkIcon} size={16} className="shrink-0 text-[#70706b]" aria-hidden="true" />
                            <a href={`https://github.com/${repository.fullName}`} target="_blank" rel="noreferrer" className="truncate text-[13px] font-semibold text-[#33332f] hover:text-[#2764d8]">{repository.fullName}</a>
                            {repository.isPrivate ? <DashboardIcon icon={LockKeyIcon} size={14} className="shrink-0 text-[#8c8c86]" aria-label="Private repository" /> : <span className="rounded border border-[#deded8] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#82827c]">Public</span>}
                          </div>
                          <p className="mt-1 pl-6 text-[12px] text-[#85857f]">Default branch: {repository.defaultBranch}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#74746f]">
                          <DashboardIcon icon={Shield01Icon} size={16} className={repository.autoReviewEnabled ? "text-[#198b4d]" : "text-[#aaa9a3]"} aria-hidden="true" />
                          {repository.autoReviewEnabled ? "Auto-review enabled" : "Auto-review paused"}
                        </div>
                        <button onClick={() => void toggleAutoReview(repository.id, !repository.autoReviewEnabled)} disabled={isUpdating} type="button" role="switch" aria-checked={repository.autoReviewEnabled} aria-label={`Turn automatic review ${repository.autoReviewEnabled ? "off" : "on"} for ${repository.fullName}`} className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${repository.autoReviewEnabled ? "bg-[#2764d8]" : "bg-[#d9d9d3]"}`}>
                          <span className={`grid size-5 place-items-center rounded-full bg-white shadow-sm transition-transform ${repository.autoReviewEnabled ? "translate-x-5" : "translate-x-0"}`}>
                            {isUpdating ? <DashboardIcon icon={Refresh01Icon} size={12} className="animate-spin text-[#62625e]" aria-hidden="true" /> : repository.autoReviewEnabled ? <DashboardIcon icon={CheckIcon} size={12} className="text-[#2764d8]" aria-hidden="true" /> : <DashboardIcon icon={ToggleLeftIcon} size={12} className="text-[#777771]" aria-hidden="true" />}
                          </span>
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-[13px] font-medium text-[#4d4d48]">No active repositories in this installation.</p>
                  <p className="mt-1 text-[12px] text-[#898983]">Update repository access in GitHub, then sync this installation.</p>
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="No repositories are connected"
          description="Install the OpenMerge GitHub App and select the repositories you want reviewed."
          action={<a href="https://github.com/apps/openmerge-app/installations/select_target" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white">Install on GitHub <DashboardIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" /></a>}
        />
      )}
    </div>
  );
}
