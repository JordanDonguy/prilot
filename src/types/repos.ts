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
