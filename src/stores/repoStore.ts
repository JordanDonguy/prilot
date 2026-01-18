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

  updateDraftPrCount: (repoId: string, delta: number) => void;
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

  updateDraftPrCount: (repoId, delta) =>
    set((state) => {
      const repo = state.repos[repoId];
      if (!repo) return state;

      return {
        repos: {
          ...state.repos,
          [repoId]: {
            ...repo,
            draftPrCount: Math.max(0, repo.draftPrCount + delta),
          },
        },
      };
    }),
}));
