export interface IPullRequest {
  id: string;
  title: string;
  status: "draft" | "sent";
  baseBranch: string;
  compareBranch: string;
  createdAt: string;
};
