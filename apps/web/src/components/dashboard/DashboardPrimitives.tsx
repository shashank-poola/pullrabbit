import type { ReactNode } from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { reviewStatusMeta, severityMeta } from "@/lib/dashboard";
import type { CommentSeverity, ReviewStatus } from "@/types/dashboard";

export function DashboardIcon({ icon, size = 16, strokeWidth = 1.8, ...props }: HugeiconsIconProps) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} {...props} />;
}

export function StatusBadge({ status }: { status: ReviewStatus }) {
  const meta = reviewStatusMeta[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", meta.className)}>
      <span className={cn("size-1.5 rounded-full", status === "RUNNING" || status === "RETRYING" ? "animate-pulse bg-current" : "bg-current")} />
      {meta.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: CommentSeverity }) {
  const meta = severityMeta[severity];

  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]", meta.className)}>
      {meta.label}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  accent = "blue",
}: {
  label: string;
  value: number | string;
  hint: string;
  icon: ReactNode;
  accent?: "blue" | "green" | "orange" | "red";
}) {
  const accents = {
    blue: "bg-[#edf3ff] text-[#2860c8]",
    green: "bg-[#edf9f1] text-[#167541]",
    orange: "bg-[#fff5e9] text-[#b65b07]",
    red: "bg-[#fff0f0] text-[#c23c3c]",
  };

  return (
    <section className="rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-[#777771]">{label}</p>
          <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.06em] text-[#20201e]">{value}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-xl", accents[accent])}>{icon}</span>
      </div>
      <p className="mt-4 text-[12px] leading-5 text-[#868681]">{hint}</p>
    </section>
  );
}

export function DashboardLoading({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-[#e7e7e2] bg-white">
      <div className="flex items-center gap-3 text-[13px] font-medium text-[#73736e]">
        <DashboardIcon icon={Loading03Icon} size={16} className="animate-spin text-[#2764d8]" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}

export function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7d7d1] bg-[#fcfcfa] px-6 text-center">
      <div className="grid size-11 place-items-center rounded-2xl bg-[#edf3ff] text-[17px] font-semibold text-[#2764d8]">OM</div>
      <h2 className="mt-4 text-[16px] font-semibold tracking-[-0.025em] text-[#262622]">{title}</h2>
      <p className="mt-2 max-w-sm text-[13px] leading-6 text-[#777771]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
