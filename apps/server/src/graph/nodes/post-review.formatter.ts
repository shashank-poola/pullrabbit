import type { AgentComment, PRReviewStateType } from "../review.state";
import type { ReviewSummary } from "../../agent/review-summary";

const SECTION_ORDER: AgentComment["category"][] = [
  "BUG",
  "SECURITY",
  "PERFORMANCE",
  "REFACTOR",
  "STYLE",
  "DOCUMENTATION",
  "TEST",
  "OTHER",
];

const SEVERITY_EMOJI: Record<AgentComment["severity"], string> = {
  CRITICAL: "⛔",
  HIGH: "🔴",
  MEDIUM: "⚠️",
  LOW: "🔵",
  INFO: "ℹ️",
};

const SECTION_META: Record<AgentComment["category"], { emoji: string; label: string; singular: string }> = {
  BUG: { emoji: "🔍", label: "Potential Issues", singular: "potential issue" },
  SECURITY: { emoji: "🔒", label: "Security Issues", singular: "security issue" },
  PERFORMANCE: { emoji: "⚡", label: "Performance", singular: "performance issue" },
  REFACTOR: { emoji: "💡", label: "Code Suggestions", singular: "code suggestion" },
  STYLE: { emoji: "💡", label: "Code Suggestions", singular: "code suggestion" },
  DOCUMENTATION: { emoji: "📝", label: "Documentation", singular: "documentation item" },
  TEST: { emoji: "🧪", label: "Test Coverage", singular: "test coverage item" },
  OTHER: { emoji: "💡", label: "Other", singular: "other item" },
};

const SEVERITY_GROUPED_LABELS = new Set(["Security Issues", "Performance"]);
const SEVERITY_ORDER: AgentComment["severity"][] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

type SectionData = { emoji: string; label: string; singular: string; items: AgentComment[] };

const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? "s" : ""}`;
const countBlocking = (items: AgentComment[]) => items.filter((comment) => comment.blocking).length;
const clip = (text: string, max: number) => text.length > max ? `${text.slice(0, max - 3)}…` : text;
const firstSentence = (text: string) => text.split(/\.\s+/)[0]?.trim() ?? text;
const endWithPeriod = (text: string) => {
  const trimmed = text.trim().replace(/[—–]/g, "-");
  if (!trimmed) return trimmed;
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};
const sanitizeInlineCode = (text: string, max: number) =>
  clip(text.trim().replace(/\s+/g, " ").replace(/`/g, "'").replace(/[—–]/g, "-"), max);
const prTitleTag = (title: string | null): string => {
  if (!title?.trim()) return "";
  return ` - ${clip(title.trim().replace(/[—–]/g, "-"), 140)}`;
};

const buildSummaryLine = (fileCount: number, comments: AgentComment[]): string => {
  const files = plural(fileCount, "file");
  if (comments.length === 0) return `Reviewed **${files}** - no issues found.`;
  const blocking = countBlocking(comments);
  const blockingPart = blocking > 0 ? ` · **${blocking} blocking**` : "";
  return `Reviewed **${files}** · **${plural(comments.length, "issue")}**${blockingPart}`;
};

const buildSectionIntro = (singular: string, items: AgentComment[]): string => {
  const blocking = countBlocking(items);
  const blockingNote = blocking > 0 ? `, **${blocking} blocking**` : "";
  const preview = endWithPeriod(clip(firstSentence(items[0]?.body ?? ""), 90));
  return `Found **${plural(items.length, singular)}**${blockingNote}. ${preview}`;
};

const renderItem = (comment: AgentComment): string[] => {
  const blockingBadge = comment.blocking ? " · **blocking**" : "";
  const body = endWithPeriod(clip(firstSentence(comment.body), 100));
  const lines = [`- \`${comment.filePath}:${comment.line}\`${blockingBadge} - ${body}`];

  if (comment.currentCode) {
    lines.push(`  - **Current code:** \`${sanitizeInlineCode(comment.currentCode, 200)}\``);
  }
  if (comment.suggestion) {
    lines.push(`  - **Fix:** \`${sanitizeInlineCode(comment.suggestion, 200)}\``);
  }

  return lines;
};

const renderSeverityGrouped = (items: AgentComment[]): string[] => {
  const grouped = new Map<AgentComment["severity"], AgentComment[]>();
  for (const comment of items) {
    const group = grouped.get(comment.severity) ?? [];
    group.push(comment);
    grouped.set(comment.severity, group);
  }

  const lines: string[] = [];
  for (const severity of SEVERITY_ORDER) {
    const group = grouped.get(severity);
    if (!group?.length) continue;

    const blockingTag = countBlocking(group) > 0 ? ` · ${countBlocking(group)} blocking` : "";
    lines.push(`**${SEVERITY_EMOJI[severity]} ${severity}${blockingTag}**`, "");
    for (const comment of group) lines.push(...renderItem(comment));
    lines.push("");
  }

  return lines;
};

const buildSections = (comments: AgentComment[]): Map<string, SectionData> => {
  const sections = new Map<string, SectionData>();
  for (const category of SECTION_ORDER) {
    const items = comments.filter((comment) => comment.category === category);
    if (!items.length) continue;

    const { emoji, label, singular } = SECTION_META[category];
    if (!sections.has(label)) sections.set(label, { emoji, label, singular, items: [] });
    sections.get(label)?.items.push(...items);
  }
  return sections;
};

export const buildReviewComment = (
  state: PRReviewStateType,
  comments: AgentComment[],
  durationMs: number,
  reviewSummary: ReviewSummary | null = null,
): string => {
  const hasCriticalOrHigh = comments.some(
    (comment) => comment.severity === "CRITICAL" || comment.severity === "HIGH",
  );
  const durationSec = (durationMs / 1000).toFixed(1);
  const verdict = hasCriticalOrHigh
    ? "⛔ **Changes requested**. Blocking issues must be resolved before merging."
    : comments.length > 0
      ? "⚠️ **Review complete**. Non-blocking suggestions noted."
      : "✅ **Looks good to merge!**";
  const filesNeedingAttention = [...new Set(comments.map((comment) => comment.filePath))].slice(0, 5);
  const fallbackSummary: ReviewSummary = {
    overview: comments.length === 0
      ? `This PR updates ${state.prTitle?.trim() || "the repository"}.`
      : "This PR introduces changes that require review before merging.",
    bullets: comments.length === 0
      ? [`Updates ${plural(state.changedFiles.length, "changed file")}.`]
      : [`Introduces ${plural(comments.length, "review finding")}.`],
    mergeAssessment: comments.length === 0
      ? "No actionable issues were detected."
      : "The PR is not yet safe to merge.",
    mergeReason: comments.length === 0
      ? "No blocking issues were found in the changed code."
      : "Blocking findings require attention before merging.",
  };
  const summary = reviewSummary ?? fallbackSummary;
  const lines: string[] = [
    `## OpenMerge Summary${prTitleTag(state.prTitle)}`,
    "",
    endWithPeriod(clip(summary.overview, 240)),
    "",
    ...summary.bullets.slice(0, 4).map((bullet) => `- ${endWithPeriod(clip(bullet, 180))}`),
    "",
  ];

  if (comments.length === 0) {
    lines.push(
      verdict,
      "",
      "No actionable issues found in " + plural(state.changedFiles.length, "changed file") + ".",
      "No blocking issues detected.",
      "",
    );
  } else {
    const blockingCount = countBlocking(comments);
    const mergeAssessment = blockingCount > 0
      ? `The PR is not yet safe to merge because ${plural(blockingCount, "blocking issue")} ${blockingCount === 1 ? "requires" : "require"} attention.`
      : "The PR has no blocking issues; the remaining suggestions are non-blocking.";
    lines.push(
      mergeAssessment,
      endWithPeriod(clip(summary.mergeReason, 240)),
      "",
      ...(filesNeedingAttention.length > 0
        ? [`**Files Needing Attention:** ${filesNeedingAttention.map((file) => `\`${file}\``).join(", ")}`, ""]
        : []),
      buildSummaryLine(state.changedFiles.length, comments),
      "",
      verdict,
      "",
    );
  }

  for (const [, { emoji, label, singular, items }] of buildSections(comments)) {
    const blocking = countBlocking(items);
    const blockingTag = blocking > 0 ? ` · ${blocking} blocking` : "";
    const summary = `${emoji} ${label} &nbsp;·&nbsp; ${plural(items.length, "issue")}${blockingTag}`;

    lines.push(
      "<details>",
      `<summary>${summary}</summary>`,
      "",
      buildSectionIntro(singular, items),
      "",
    );

    if (SEVERITY_GROUPED_LABELS.has(label)) {
      lines.push(...renderSeverityGrouped(items));
    } else {
      for (const comment of items) lines.push(...renderItem(comment));
      lines.push("");
    }

    lines.push("</details>", "");
  }

  lines.push("---");
  lines.push(`*Reviewed ${plural(state.changedFiles.length, "file")} in ${durationSec}s*`);

  return lines.join("\n");
};
