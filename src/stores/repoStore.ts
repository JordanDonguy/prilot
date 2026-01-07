import { create } from "zustand";
import type { IPullRequest } from "@/types/pullRequests";
import type { IRepository } from "@/types/repos";

export interface RepoSnapshot extends IRepository {
  branches: string[];
  pullRequests?: IPullRequest[];
  commitsCount: number;
}

interface RepoStore {
  repos: Record<string, RepoSnapshot>;
  setRepo: (repo: RepoSnapshot) => void;
}

export const useRepoStore = create<RepoStore>((set) => ({
  repos: {},

  setRepo: (repo) =>
    set((state) => ({
      repos: {
        ...state.repos,
        [repo.id]: repo,
      },
    })),
}));
