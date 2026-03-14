import { vi } from "vitest";

// GitHub fetch client — no real network calls in tests
vi.mock("@/lib/server/github/client", () => ({
	githubFetch: vi.fn(),
}));

// GitHub compare — used by compare-commits route
vi.mock("@/lib/server/github/compare", () => ({
	getCompareData: vi.fn().mockResolvedValue({ commits: [] }),
}));
