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

export interface IGitHubCompareResponse {
  commits: IGitHubCommit[];
  // There are more fields like files, status, total_commits, etc.
  // We ignore them since we don’t use them
}
