import type { IPullRequest } from "./pullRequests";

export interface IRepository {
	id: string;
	name: string;
	provider: "github" | "gitlab";
	providerRepoId: string;
	owner: string;
	isPrivate: boolean;
	defaultBranch: string;
}

export interface IRepositoryResponse {
	repository: IRepository;
	branches: string[];
	pullRequests: IPullRequest[];
}
