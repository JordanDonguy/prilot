// ---- Repo invitation info ----
export interface IInvitation {
  id: string;
  token: string;
  repositoryId: string;
  repositoryName: string;
	repositoryProvider: "github" | "gitlab";
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
};

// ---- Repo info ----
export interface IRepository {
  id: string;
  name: string;
  provider: "github" | "gitlab";
  owner: string;
  defaultBranch: string;
  installationId: string;
  createdAt: Date;
  userRole: "owner" | "member";
  isPrivate: boolean;
  draftPrCount: number;
  sentPrCount: number; 
}

// ---- Full repo API response ----
export interface IRepositoryResponse {
  repository: IRepository;
  branches: string[];
  commitsCount: number;
}
