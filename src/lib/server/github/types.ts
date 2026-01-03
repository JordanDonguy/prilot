export interface IGitHubInstallation {
	id: number;
	account: {
		login: string;
		id: number;
		type: "User" | "Organization" | string;
	};
	repository_selection: "all" | "selected";
	permissions: Record<string, string>;
	created_at: string;
	updated_at: string;
}

export interface IGitHubRepo {
	id: number;
	name: string; // short name
	full_name: string; // full name with owner
	private: boolean;
	default_branch: string;
	owner: {
		login: string; // owner's username/org name
		id: number;
		type: "User" | "Organization" | string;
	};
}

export interface IGitHubReposResponse {
	total_count: number;
	repositories: IGitHubRepo[];
}

export interface IGitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
};

