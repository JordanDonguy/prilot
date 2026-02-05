export interface IGitHubCommit {
	sha: string;
	commit: {
		message: string;
		author: {
			name: string;
			email: string;
			date: string;
		};
	};
	parents: {
		sha: string;
		url: string;
		html_url: string;
	}[];
}

export interface IGitHubFile {
	filename: string;
	status: "added" | "modified" | "deleted";
	additions: number;
	deletions: number;
	changes: number;
	patch?: string;
};

export interface IGitHubCompareResponse {
	commits: IGitHubCommit[];
	files?: IGitHubFile[];
}
