export type ReviewStatus = "QUEUED" | "RUNNING" | "RETRYING" | "COMPLETED" | "FAILED";

export type CommentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type CommentCategory =
  | "BUG"
  | "SECURITY"
  | "PERFORMANCE"
  | "STYLE"
  | "REFACTOR"
  | "DOCUMENTATION"
  | "TEST"
  | "OTHER";

export type RecentReview = {
  id: string;
  prNumber: number;
  status: ReviewStatus;
  totalComments: number;
  createdAt: string;
  completedAt: string | null;
};

export type Repository = {
  id: string;
  installationId: string;
  githubRepoId: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  isActive: boolean;
  autoReviewEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DashboardRepository = Repository & {
  recentReviews: RecentReview[];
};

export type Installation = {
  id: string;
  userId: string;
  githubInstallationId: string;
  githubAccountId: string;
  githubAccountLogin: string;
  githubAccountType: string;
  status: "ACTIVE" | "SUSPENDED" | "REMOVED";
  isPersonalAccount: boolean;
  createdAt: string;
  updatedAt: string;
  repositories: DashboardRepository[];
};

export type DashboardResponse = {
  success: boolean;
  installations: Installation[];
  error: string | null;
};

export type ReviewRepository = Pick<Repository, "id" | "fullName" | "owner" | "name">;

export type ReviewSession = {
  id: string;
  repositoryId: string;
  prNumber: number;
  headSha: string | null;
  reviewKey?: string | null;
  jobId?: string | null;
  baseBranch: string;
  status: ReviewStatus;
  attemptCount?: number;
  summary: string | null;
  filesReviewed: number;
  totalComments: number;
  githubReviewId: string | null;
  errorMessage: string | null;
  lastErrorCode?: string | null;
  startedAt?: string | null;
  heartbeatAt?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  repository: ReviewRepository;
};

export type ReviewComment = {
  id: string;
  reviewSessionId: string;
  filePath: string;
  line: number;
  startLine: number | null;
  side: string;
  startSide: string | null;
  title: string | null;
  body: string;
  severity: CommentSeverity;
  category: CommentCategory;
  suggestion: string | null;
  githubCommentId: string | null;
  createdAt: string;
};

export type ReviewDetail = ReviewSession & {
  comments: ReviewComment[];
};

export type ReviewsResponse = {
  success: boolean;
  reviews: ReviewSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error: string | null;
};

export type ReviewDetailResponse = {
  success: boolean;
  review: ReviewDetail;
  error: string | null;
};

export type RepoUpdateResponse = {
  success: boolean;
  repo: Repository;
  error: string | null;
};

export type SyncInstallationResponse = {
  success: boolean;
  repos: Repository[];
  error: string | null;
};
