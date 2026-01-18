// ---- Pull Request info ----
export interface IPullRequest {
  id: string;
  title: string;
  status: "draft" | "sent";
  baseBranch: string;
  compareBranch: string;
  updatedAt: string;
};

// ---- Pagination info ----
export interface IPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// ---- Filter info ----
export type PRFilter = "all" | "draft" | "sent";

// ---- Paginated PRs response ----
export interface IPaginatedPRsResponse {
  pullRequests: IPullRequest[];
  pagination: IPagination;
}