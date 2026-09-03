"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  FilterIcon,
  GitPullRequestIcon,
  Refresh01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { getDashboard, getReviews } from "@/lib/api";
import { formatDateTime, formatRelativeTime, githubPullRequestUrl } from "@/lib/dashboard";
import type { DashboardResponse, ReviewStatus, ReviewsResponse } from "@/types/dashboard";
import { DashboardIcon, DashboardLoading, EmptyPanel, StatusBadge } from "./DashboardPrimitives";

const reviewStatuses: Array<{ value: "ALL" | ReviewStatus; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "QUEUED", label: "Queued" },
  { value: "RUNNING", label: "Reviewing" },
  { value: "RETRYING", label: "Retrying" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Needs attention" },
];

export function ReviewsScreen() {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"ALL" | ReviewStatus>("ALL");
  const [repositoryId, setRepositoryId] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [nextReviews, nextDashboard] = await Promise.all([getReviews(page), getDashboard()]);
      setReviewsData(nextReviews);
      setDashboardData(nextDashboard);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load review history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const repositories = useMemo(
    () => dashboardData?.installations.flatMap((installation) => installation.repositories) ?? [],
    [dashboardData]
  );

  const filteredReviews = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (reviewsData?.reviews ?? []).filter((review) => {
      const matchesStatus = status === "ALL" || review.status === status;
      const matchesRepository = repositoryId === "ALL" || review.repository.id === repositoryId;
      const matchesSearch = !term || review.repository.fullName.toLowerCase().includes(term) || `#${review.prNumber}`.includes(term);
      return matchesStatus && matchesRepository && matchesSearch;
    });
  }, [repositoryId, reviewsData, search, status]);

  if (loading && !reviewsData) {
    return <DashboardLoading label="Loading review history" />;
  }

  if (error && !reviewsData) {
    return (
      <EmptyPanel
        title="Review history is unavailable"
        description={error === "UNAUTHORIZED" ? "Your session has expired. Sign in with GitHub again to view reviews." : "Check that the OpenMerge API is running, then try again."}
        action={<button onClick={() => void load()} type="button" className="rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white">Try again</button>}
      />
    );
  }

  const pagination = reviewsData?.pagination;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2764d8]">Review history</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.06em] text-[#20201e] sm:text-[38px]">Every review, in one place.</h1>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#73736e]">Inspect completed, active, and failed review sessions without searching through GitHub notifications.</p>
        </div>
        <button onClick={() => void load(true)} type="button" disabled={refreshing} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#ddddD7] bg-white px-4 text-[12px] font-semibold text-[#4b4b46] transition-colors hover:border-[#bfbfb8] hover:bg-[#f7f7f4] disabled:cursor-not-allowed disabled:opacity-60">
          <DashboardIcon icon={Refresh01Icon} size={14} className={refreshing ? "animate-spin" : undefined} aria-hidden="true" />
          Refresh
        </button>
      </section>

      <section className="rounded-2xl border border-[#e5e5e0] bg-white p-4 shadow-[0_8px_24px_rgba(23,23,23,0.035)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(180px,0.9fr)_minmax(180px,0.8fr)_minmax(0,1.3fr)]">
          <label className="relative block">
            <span className="sr-only">Filter reviews by status</span>
            <DashboardIcon icon={FilterIcon} size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8b85]" aria-hidden="true" />
            <select value={status} onChange={(event) => setStatus(event.target.value as "ALL" | ReviewStatus)} className="h-10 w-full appearance-none rounded-xl border border-[#e3e3dd] bg-[#fcfcfa] pl-9 pr-3 text-[12px] font-medium text-[#4d4d47] outline-none transition-colors focus:border-[#8fb2fa]">
              {reviewStatuses.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter reviews by repository</span>
            <select value={repositoryId} onChange={(event) => setRepositoryId(event.target.value)} className="h-10 w-full rounded-xl border border-[#e3e3dd] bg-[#fcfcfa] px-3 text-[12px] font-medium text-[#4d4d47] outline-none transition-colors focus:border-[#8fb2fa]">
              <option value="ALL">All repositories</option>
              {repositories.map((repository) => <option key={repository.id} value={repository.id}>{repository.fullName}</option>)}
            </select>
          </label>
          <label className="relative block">
            <span className="sr-only">Search current review page</span>
            <DashboardIcon icon={Search01Icon} size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8b85]" aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search repository or PR number" className="h-10 w-full rounded-xl border border-[#e3e3dd] bg-[#fcfcfa] pl-9 pr-3 text-[12px] font-medium text-[#4d4d47] outline-none placeholder:text-[#aaa9a3] transition-colors focus:border-[#8fb2fa]" />
          </label>
        </div>
        <p className="mt-3 text-[11px] text-[#92928c]">Filters apply to the reviews on this page. Server-side filtering can be added once review volume grows.</p>
      </section>

      {error ? <div className="rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">Showing your last loaded results. Refresh failed: {error}</div> : null}

      <section className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
        <div className="flex flex-col justify-between gap-2 border-b border-[#ecece7] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.025em]">Review sessions</h2>
            <p className="mt-1 text-[12px] text-[#83837d]">{pagination?.total ?? 0} total {pagination?.total === 1 ? "review" : "reviews"} · newest first</p>
          </div>
          <p className="text-[12px] font-medium text-[#777771]">{filteredReviews.length} visible on this page</p>
        </div>

        {filteredReviews.length ? (
          <div className="divide-y divide-[#efefeb]">
            {filteredReviews.map((review) => (
              <article key={review.id} className="grid gap-4 px-5 py-5 transition-colors hover:bg-[#fcfcfa] md:grid-cols-[minmax(0,1.3fr)_auto_auto] md:items-center md:px-6">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[#f0f4ff] text-[#2764d8]"><DashboardIcon icon={GitPullRequestIcon} size={16} aria-hidden="true" /></span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-[13px] font-semibold text-[#33332f]">{review.repository.fullName}</p>
                      <span className="text-[12px] text-[#8b8b85]">PR #{review.prNumber}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#85857f]">Opened {formatRelativeTime(review.createdAt)} · {review.filesReviewed} {review.filesReviewed === 1 ? "file" : "files"} reviewed · {review.totalComments} {review.totalComments === 1 ? "finding" : "findings"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#7d7d77] md:block md:text-right">
                  <p>{review.completedAt ? `Finished ${formatDateTime(review.completedAt)}` : "Awaiting completion"}</p>
                  {review.errorMessage ? <p className="mt-1 max-w-[230px] truncate text-[#c23c3c]" title={review.errorMessage}>{review.errorMessage}</p> : null}
                </div>
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <StatusBadge status={review.status} />
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/reviews/${review.id}`} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[12px] font-semibold text-[#2764d8] transition-colors hover:bg-[#edf3ff]">Details <DashboardIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" /></Link>
                    <a href={githubPullRequestUrl(review.repository.fullName, review.prNumber)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#74746f] transition-colors hover:bg-[#f1f1ed] hover:text-[#2764d8]" aria-label={`Open pull request ${review.prNumber} on GitHub`}><DashboardIcon icon={GitPullRequestIcon} size={14} aria-hidden="true" /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <DashboardIcon icon={Search01Icon} size={20} className="mx-auto text-[#a3a39d]" aria-hidden="true" />
            <p className="mt-3 text-[13px] font-medium text-[#4d4d48]">No reviews match these filters.</p>
            <button type="button" onClick={() => { setStatus("ALL"); setRepositoryId("ALL"); setSearch(""); }} className="mt-3 text-[12px] font-semibold text-[#2764d8] hover:text-[#174cae]">Clear filters</button>
          </div>
        )}
      </section>

      {pagination && pagination.pages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] text-[#777771]">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button type="button" disabled={pagination.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex h-9 items-center gap-1 rounded-full border border-[#ddddD7] bg-white px-3 text-[12px] font-semibold text-[#4b4b46] disabled:cursor-not-allowed disabled:opacity-45"><DashboardIcon icon={ArrowLeft01Icon} size={14} aria-hidden="true" />Previous</button>
            <button type="button" disabled={pagination.page >= pagination.pages} onClick={() => setPage((current) => current + 1)} className="inline-flex h-9 items-center gap-1 rounded-full border border-[#ddddD7] bg-white px-3 text-[12px] font-semibold text-[#4b4b46] disabled:cursor-not-allowed disabled:opacity-45">Next<DashboardIcon icon={ArrowRight01Icon} size={14} aria-hidden="true" /></button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
