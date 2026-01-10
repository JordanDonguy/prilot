import type { IPullRequest } from "./pullRequests";

export interface IRepository {
	id: string;
	name: string;
	provider: "github" | "gitlab";
	owner: string;
	defaultBranch: string;
	installationId: string;
	createdAt: Date;
	userRole: "owner" | "member";
	isPrivayte: boolean;
	draftPrCount: number;
	sentPrCount: number;
}

export interface IRepositoryResponse {
	repository: IRepository;
	branches: string[];
	pullRequests: IPullRequest[];
	commitsCount: number;
}
