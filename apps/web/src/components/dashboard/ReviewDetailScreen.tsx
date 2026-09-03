"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert02Icon,
  ArrowLeft01Icon,
  ExternalLinkIcon,
  FileCodeIcon,
  Files01Icon,
  GitPullRequestIcon,
  HashIcon,
  Refresh01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { getReview } from "@/lib/api";
import { formatDateTime, formatDuration, formatRelativeTime, githubPullRequestUrl } from "@/lib/dashboard";
import type { CommentSeverity, ReviewDetailResponse } from "@/types/dashboard";
import { DashboardIcon, DashboardLoading, EmptyPanel, MetricCard, SeverityBadge, StatusBadge } from "./DashboardPrimitives";

const severityOrder: CommentSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

export function ReviewDetailScreen({ reviewId }: { reviewId: string }) {
  const [data, setData] = useState<ReviewDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReview = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const nextData = await getReview(reviewId);
      setData(nextData);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load this review.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [reviewId]);

  useEffect(() => {
    void loadReview();
  }, [loadReview]);

  const activeReview = data?.review.status === "QUEUED" || data?.review.status === "RUNNING" || data?.review.status === "RETRYING";

  useEffect(() => {
    if (!activeReview) return;

    const intervalId = window.setInterval(() => void loadReview(true), 5_000);
    return () => window.clearInterval(intervalId);
  }, [activeReview, loadReview]);

  const severityCounts = useMemo(() => {
    const counts = new Map<CommentSeverity, number>();
    severityOrder.forEach((severity) => counts.set(severity, 0));
    data?.review.comments.forEach((comment) => counts.set(comment.severity, (counts.get(comment.severity) ?? 0) + 1));
    return counts;
  }, [data]);

  if (loading && !data) {
    return <DashboardLoading label="Loading review details" />;
  }

  if (error && !data) {
    return (
      <EmptyPanel
        title="This review could not be loaded"
        description={error === "REVIEW_NOT_FOUND" ? "The review is unavailable, or it belongs to a repository that is no longer connected." : "Check that the OpenMerge API is running, then try again."}
        action={<button onClick={() => void loadReview()} type="button" className="rounded-full bg-[#20201e] px-4 py-2.5 text-[12px] font-semibold text-white">Try again</button>}
      />
    );
  }

  const review = data?.review;
  if (!review) return null;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard/reviews" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#686863] transition-colors hover:text-[#2764d8]"><DashboardIcon icon={ArrowLeft01Icon} size={14} aria-hidden="true" />Back to reviews</Link>
        <button onClick={() => void loadReview(true)} type="button" disabled={refreshing} className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#ddddD7] bg-white px-3.5 text-[12px] font-semibold text-[#4b4b46] transition-colors hover:border-[#bfbfb8] hover:bg-[#f7f7f4] disabled:cursor-not-allowed disabled:opacity-60">
          <DashboardIcon icon={Refresh01Icon} size={14} className={refreshing ? "animate-spin" : undefined} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">Showing your last loaded review. Refresh failed: {error}</div> : null}

      <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)] sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2764d8]">Review detail</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="truncate text-[28px] font-semibold leading-none tracking-[-0.06em] text-[#20201e] sm:text-[36px]">{review.repository.fullName}</h1>
              <span className="text-[18px] font-medium text-[#8b8b85]">PR #{review.prNumber}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#777771]">
              <span className="inline-flex items-center gap-1.5"><DashboardIcon icon={HashIcon} size={14} aria-hidden="true" />{review.headSha ? review.headSha.slice(0, 8) : "Commit unavailable"}</span>
              <span>Base branch: {review.baseBranch}</span>
              <span>Started {formatDateTime(review.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <StatusBadge status={review.status} />
            <a href={githubPullRequestUrl(review.repository.fullName, review.prNumber)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#20201e] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#343430]">
              Open on GitHub
              <DashboardIcon icon={ExternalLinkIcon} size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {activeReview ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#cddcff] bg-[#f1f5ff] px-4 py-3 text-[13px] text-[#315baf]">
            <DashboardIcon icon={Refresh01Icon} size={16} className="mt-0.5 shrink-0 animate-spin" aria-hidden="true" />
            <p>OpenMerge is still reviewing this pull request. This page refreshes automatically every five seconds.</p>
          </div>
        ) : null}

        {review.status === "FAILED" ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#f2d1d1] bg-[#fff6f6] px-4 py-3 text-[13px] text-[#a53d3d]">
            <DashboardIcon icon={Alert02Icon} size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div><p className="font-semibold">This review needs attention.</p><p className="mt-1 leading-5">{review.errorMessage ?? "The review worker could not finish this session. Check the worker logs, then open or update the pull request to trigger a new review."}</p></div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Files reviewed" value={review.filesReviewed} hint="Files included in the review analysis" icon={<DashboardIcon icon={Files01Icon} size={18} aria-hidden="true" />} />
        <MetricCard label="Findings posted" value={review.totalComments} hint="Inline findings generated for this review" icon={<DashboardIcon icon={SparklesIcon} size={18} aria-hidden="true" />} accent="orange" />
        <MetricCard label="Review duration" value={formatDuration(review.startedAt ?? review.createdAt, review.completedAt)} hint={review.completedAt ? `Completed ${formatRelativeTime(review.completedAt)}` : "Available after review completes"} icon={<DashboardIcon icon={GitPullRequestIcon} size={18} aria-hidden="true" />} accent={review.status === "FAILED" ? "red" : "green"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f0f4ff] text-[#2764d8]"><DashboardIcon icon={SparklesIcon} size={16} aria-hidden="true" /></span>
            <div><h2 className="text-[15px] font-semibold tracking-[-0.025em]">OpenMerge summary</h2><p className="mt-0.5 text-[12px] text-[#85857f]">The review summary posted to the pull request.</p></div>
          </div>
          <div className="mt-5 rounded-xl bg-[#fafaf7] px-4 py-4 text-[13px] leading-6 text-[#5c5c56] whitespace-pre-wrap">
            {review.summary ?? (activeReview ? "OpenMerge is preparing the final summary." : "No review summary was recorded for this session.")}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)] sm:p-6">
          <h2 className="text-[15px] font-semibold tracking-[-0.025em]">Findings by severity</h2>
          <p className="mt-1 text-[12px] text-[#85857f]">Only findings stored for this review are counted.</p>
          <div className="mt-5 space-y-3">
            {severityOrder.map((severity) => {
              const count = severityCounts.get(severity) ?? 0;
              return (
                <div key={severity} className="flex items-center justify-between gap-3">
                  <SeverityBadge severity={severity} />
                  <span className="text-[13px] font-semibold text-[#41413c]">{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
        <div className="border-b border-[#ecece7] px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-semibold tracking-[-0.025em]">Review findings</h2>
          <p className="mt-1 text-[12px] text-[#83837d]">Each item links back to the pull request where OpenMerge left the inline feedback.</p>
        </div>
        {review.comments.length ? (
          <div className="divide-y divide-[#efefeb]">
            {review.comments.map((comment) => (
              <article key={comment.id} className="px-5 py-5 sm:px-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 items-center gap-2">
                    <DashboardIcon icon={FileCodeIcon} size={16} className="shrink-0 text-[#70706b]" aria-hidden="true" />
                    <p className="truncate font-mono text-[12px] text-[#3e3e39]">{comment.filePath}:{comment.line}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2"><SeverityBadge severity={comment.severity} /><span className="rounded-full bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#75756f]">{comment.category}</span></div>
                </div>
                {comment.title ? <h3 className="mt-4 text-[14px] font-semibold tracking-[-0.015em] text-[#33332f]">{comment.title}</h3> : null}
                <p className="mt-2 whitespace-pre-wrap text-[13px] leading-6 text-[#666660]">{comment.body}</p>
                {comment.suggestion ? <div className="mt-4 rounded-xl border border-[#dceadd] bg-[#f4fbf5] px-3.5 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#258051]">Suggested direction</p><p className="mt-1.5 whitespace-pre-wrap font-mono text-[12px] leading-5 text-[#4a6653]">{comment.suggestion}</p></div> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <DashboardIcon icon={GitPullRequestIcon} size={20} className="mx-auto text-[#a3a39d]" aria-hidden="true" />
            <p className="mt-3 text-[13px] font-medium text-[#4d4d48]">No inline findings were recorded.</p>
            <p className="mt-1 text-[12px] leading-5 text-[#898983]">{activeReview ? "Findings will appear here when the review completes." : "Open the pull request on GitHub to view the final review comment."}</p>
          </div>
        )}
      </section>
    </div>
  );
}
