"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert02Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FolderGitIcon,
  GitPullRequestIcon,
  Refresh01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { getDashboard } from "@/lib/api";
import { formatRelativeTime, githubPullRequestUrl } from "@/lib/dashboard";
import type { DashboardResponse } from "@/types/dashboard";
import { DashboardIcon, DashboardLoading, EmptyPanel, MetricCard, StatusBadge } from "./DashboardPrimitives";

export function DashboardOverview() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const nextData = await getDashboard();
      setData(nextData);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your workspace.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const workspace = useMemo(() => {
    const installations = data?.installations ?? [];
    const repositories = installations.flatMap((installation) => installation.repositories);
    const recentReviews = repositories
      .flatMap((repository) => repository.recentReviews.map((review) => ({ review, repository })))
      .sort((left, right) => new Date(right.review.createdAt).getTime() - new Date(left.review.createdAt).getTime());

    const runningReviews = recentReviews.filter(({ review }) => ["QUEUED", "RUNNING", "RETRYING"].includes(review.status));
    const failedReviews = recentReviews.filter(({ review }) => review.status === "FAILED");
    const completedReviews = recentReviews.filter(({ review }) => review.status === "COMPLETED");
    const recentFindings = recentReviews.reduce((total, { review }) => total + review.totalComments, 0);

    return { installations, repositories, recentReviews, runningReviews, failedReviews, completedReviews, recentFindings };
  }, [data]);

  if (loading && !data) {
    return <DashboardLoading />;
  }

  if (error && !data) {
    return (
      <EmptyPanel
        title="Your workspace could not be loaded"
        description={error === "UNAUTHORIZED" ? "Your session has expired. Sign in with GitHub again to open your workspace." : "Check that the OpenMerge API is running, then try again."}
        action={
          <button onClick={() => void loadDashboard()} type="button" className="rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#343430]">
            Try again
          </button>
        }
      />
    );
  }

  const primaryInstallation = workspace.installations[0];

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2764d8]">Workspace overview</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.06em] text-[#20201e] sm:text-[38px]">Your review activity.</h1>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#73736e]">Track connected repositories and see the latest reviews OpenMerge has delivered to GitHub.</p>
        </div>
        <button onClick={() => void loadDashboard(true)} type="button" disabled={refreshing} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#ddddD7] bg-white px-4 text-[12px] font-semibold text-[#4b4b46] transition-colors hover:border-[#bfbfb8] hover:bg-[#f7f7f4] disabled:cursor-not-allowed disabled:opacity-60">
          <DashboardIcon icon={Refresh01Icon} size={14} className={refreshing ? "animate-spin" : undefined} aria-hidden="true" />
          Refresh
        </button>
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">
          <DashboardIcon icon={Alert02Icon} size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>Showing your last loaded workspace. Refresh failed: {error}</p>
        </div>
      ) : null}

      {workspace.installations.length === 0 ? (
        <EmptyPanel
          title="Connect your first repository"
          description="Install the OpenMerge GitHub App, choose a repository, and every new pull request will enter the review pipeline automatically."
          action={
            <a href="https://github.com/apps/openmerge-app/installations/select_target" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#343430]">
              Install on GitHub
              <DashboardIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" />
            </a>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active repositories" value={workspace.repositories.length} hint="Repositories currently connected to OpenMerge" icon={<DashboardIcon icon={FolderGitIcon} size={18} aria-hidden="true" />} />
            <MetricCard label="Reviews in progress" value={workspace.runningReviews.length} hint="Queued, running, or retrying in recent activity" icon={<DashboardIcon icon={Clock01Icon} size={18} aria-hidden="true" />} accent="blue" />
            <MetricCard label="Completed reviews" value={workspace.completedReviews.length} hint="Completed reviews in the current activity window" icon={<DashboardIcon icon={CheckmarkCircle02Icon} size={18} aria-hidden="true" />} accent="green" />
            <MetricCard label="Recent findings" value={workspace.recentFindings} hint="Inline findings across the reviews shown below" icon={<DashboardIcon icon={SparklesIcon} size={18} aria-hidden="true" />} accent={workspace.failedReviews.length ? "red" : "orange"} />
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
            <section className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#ecece7] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-[-0.025em]">Recent reviews</h2>
                  <p className="mt-1 text-[12px] text-[#83837d]">The latest review sessions from your connected repositories.</p>
                </div>
                <Link href="/dashboard/reviews" className="shrink-0 text-[12px] font-semibold text-[#2764d8] hover:text-[#174cae]">View all</Link>
              </div>

              {workspace.recentReviews.length ? (
                <div className="divide-y divide-[#efefeb]">
                  {workspace.recentReviews.slice(0, 7).map(({ review, repository }) => (
                    <div key={review.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-[#fcfcfa] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[#f0f4ff] text-[#2764d8]">
                          <DashboardIcon icon={GitPullRequestIcon} size={16} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="truncate text-[13px] font-semibold text-[#33332f]">{repository.fullName}</p>
                            <span className="text-[12px] text-[#8b8b85]">PR #{review.prNumber}</span>
                          </div>
                          <p className="mt-1 text-[12px] text-[#85857f]">{review.totalComments} {review.totalComments === 1 ? "finding" : "findings"} · {formatRelativeTime(review.completedAt ?? review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <StatusBadge status={review.status} />
                        <div className="flex items-center gap-1">
                          <Link href={`/dashboard/reviews/${review.id}`} className="rounded-lg p-2 text-[#74746f] transition-colors hover:bg-[#f1f1ed] hover:text-[#2764d8]" aria-label={`View OpenMerge review for pull request ${review.prNumber}`}>
                            <DashboardIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" />
                          </Link>
                          <a href={githubPullRequestUrl(repository.fullName, review.prNumber)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#74746f] transition-colors hover:bg-[#f1f1ed] hover:text-[#2764d8]" aria-label={`Open pull request ${review.prNumber} on GitHub`}>
                            <DashboardIcon icon={GitPullRequestIcon} size={14} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <DashboardIcon icon={GitPullRequestIcon} size={20} className="mx-auto text-[#a3a39d]" aria-hidden="true" />
                  <p className="mt-3 text-[13px] font-medium text-[#4d4d48]">No reviews have run yet.</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#898983]">Open a pull request in a connected repository and OpenMerge will post the review on GitHub.</p>
                </div>
              )}
            </section>

            <div className="space-y-5">
              <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#30302c]">GitHub connection</p>
                    <p className="mt-1 text-[12px] text-[#85857f]">OpenMerge App installation</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c6ead4] bg-[#edf9f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#167541]"><span className="size-1.5 rounded-full bg-[#198b4d]" />Active</span>
                </div>
                {primaryInstallation ? (
                  <div className="mt-5 rounded-xl bg-[#f8f8f5] px-4 py-3">
                    <p className="truncate text-[13px] font-semibold text-[#393934]">{primaryInstallation.githubAccountLogin}</p>
                    <p className="mt-1 text-[11px] text-[#85857f]">{primaryInstallation.githubAccountType} account · {primaryInstallation.repositories.length} connected {primaryInstallation.repositories.length === 1 ? "repository" : "repositories"}</p>
                  </div>
                ) : null}
                <Link href="/dashboard/repositories" className="mt-4 inline-flex text-[12px] font-semibold text-[#2764d8] hover:text-[#174cae]">Manage repositories <span className="ml-1">→</span></Link>
              </section>

              <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#30302c]">Repository coverage</p>
                    <p className="mt-1 text-[12px] text-[#85857f]">Automatic review status</p>
                  </div>
                  <DashboardIcon icon={FolderGitIcon} size={16} className="text-[#2764d8]" aria-hidden="true" />
                </div>
                <div className="mt-4 space-y-3">
                  {workspace.repositories.slice(0, 4).map((repository) => (
                    <div key={repository.id} className="flex items-center justify-between gap-3">
                      <p className="truncate text-[12px] font-medium text-[#494944]">{repository.fullName}</p>
                      <span className={repository.autoReviewEnabled ? "shrink-0 text-[10px] font-semibold text-[#198b4d]" : "shrink-0 text-[10px] font-semibold text-[#9a7157]"}>{repository.autoReviewEnabled ? "On" : "Paused"}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
