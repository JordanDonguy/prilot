import { cookies } from "next/headers";
import { describe, expect, it, vi } from "vitest";
import { createPostHandler } from "@/app/api/auth/refresh/route";
import { refreshSession as realRefreshSession } from "@/lib/server/refreshSession";
import { testPrisma } from "@/tests/db";
import { passingLimiter } from "@/tests/helpers/deps";
import { parseJson } from "@/tests/helpers/request";

// Wrap realRefreshSession so it uses testPrisma + a passing limiter
const testRefreshLimiter = passingLimiter();
const refreshSession: typeof realRefreshSession = (token) =>
  realRefreshSession(token, {
    prisma: testPrisma,
    refreshLimiter: testRefreshLimiter,
  });

const POST = createPostHandler({ refreshSession });

describe("POST /api/auth/refresh", () => {
  async function seedUserWithToken(overrides: { expiresAt?: Date } = {}) {
    const user = await testPrisma.user.create({
      data: {
        email: "user@example.com",
        username: "testuser",
        password: "hashed-password",
      },
    });
    const token = await testPrisma.refreshToken.create({
      data: {
        token: "valid-refresh-token",
        userId: user.id,
        expiresAt: overrides.expiresAt ?? new Date(Date.now() + 86_400_000),
      },
    });
    return { user, token };
  }

  function mockCookiesWith(refreshToken: string | undefined) {
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi
        .fn()
        .mockImplementation((name: string) =>
          name === "refreshToken" && refreshToken
            ? { name: "refreshToken", value: refreshToken }
            : undefined,
        ),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn().mockReturnValue(false),
      getAll: vi.fn().mockReturnValue([]),
    } as never);
  }

  it("returns 200 and rotates the refresh token", async () => {
    // ARRANGE
    const { user, token } = await seedUserWithToken();
    mockCookiesWith(token.token);

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT
    expect(res.status).toBe(200);
    expect(data).toMatchObject({ success: true });

    // Old row is kept (for grace-window lookups) with a pointer to the new row
    const oldToken = await testPrisma.refreshToken.findUnique({
      where: { token: token.token },
    });
    expect(oldToken).not.toBeNull();
    expect(oldToken?.replacedByRefreshId).not.toBeNull();

    // A fresh, unreplaced token exists for the user
    const newToken = await testPrisma.refreshToken.findFirst({
      where: { userId: user.id, replacedByRefreshId: null },
    });
    expect(newToken).not.toBeNull();
    expect(newToken?.id).toBe(oldToken?.replacedByRefreshId);
  });

  it("returns 401 when no refresh token cookie is present", async () => {
    // ARRANGE
    mockCookiesWith(undefined);

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT
    expect(res.status).toBe(401);
    expect(data).toMatchObject({ error: "No refresh token" });
  });

  it("returns 401 when refresh token is not in DB", async () => {
    // ARRANGE
    mockCookiesWith("nonexistent-token");

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT
    expect(res.status).toBe(401);
    expect(data).toMatchObject({ error: "Refresh token expired" });
  });

  it("returns 401 when refresh token is expired", async () => {
    // ARRANGE
    const { token } = await seedUserWithToken({
      expiresAt: new Date(Date.now() - 1000),
    });
    mockCookiesWith(token.token);

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT
    expect(res.status).toBe(401);
    expect(data).toMatchObject({ error: "Refresh token expired" });
  });

  it("serves the replacement token when the presented one was just rotated", async () => {
    // ARRANGE — simulate a concurrent request that already rotated the token.
    const { user, token: oldToken } = await seedUserWithToken();
    const replacement = await testPrisma.refreshToken.create({
      data: {
        token: "replacement-refresh-token",
        userId: user.id,
        expiresAt: new Date(Date.now() + 86_400_000),
      },
    });
    await testPrisma.refreshToken.update({
      where: { id: oldToken.id },
      data: { replacedByRefreshId: replacement.id },
    });
    mockCookiesWith(oldToken.token);

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT — the late arriver returns 200 instead of being logged out.
    expect(res.status).toBe(200);
    expect(data).toMatchObject({ success: true });

    // No extra token row was created; the replacement is reused.
    const userTokens = await testPrisma.refreshToken.findMany({
      where: { userId: user.id },
    });
    expect(userTokens).toHaveLength(2);
  });

  it("returns 401 when the replacement is older than the grace window", async () => {
    // ARRANGE — replacement created well outside the grace window.
    const { user, token: oldToken } = await seedUserWithToken();
    const replacement = await testPrisma.refreshToken.create({
      data: {
        token: "stale-replacement-token",
        userId: user.id,
        expiresAt: new Date(Date.now() + 86_400_000),
        createdAt: new Date(Date.now() - 120_000),
      },
    });
    await testPrisma.refreshToken.update({
      where: { id: oldToken.id },
      data: { replacedByRefreshId: replacement.id },
    });
    mockCookiesWith(oldToken.token);

    // ACT
    const res = await POST();
    const data = await parseJson(res);

    // ASSERT
    expect(res.status).toBe(401);
    expect(data).toMatchObject({ error: "Refresh token expired" });
  });
});

describe("refreshSession concurrent rotation", () => {
  async function seedUserWithToken() {
    const user = await testPrisma.user.create({
      data: {
        email: "race@example.com",
        username: "raceuser",
        password: "hashed-password",
      },
    });
    const token = await testPrisma.refreshToken.create({
      data: {
        token: "race-refresh-token",
        userId: user.id,
        expiresAt: new Date(Date.now() + 86_400_000),
      },
    });
    return { user, token };
  }

  it("serializes concurrent refreshes on the same token without logging anyone out", async () => {
    // ARRANGE — one token, many racers all presenting it.
    const { user, token } = await seedUserWithToken();
    const CONCURRENCY = 5;

    // ACT — fire N parallel refreshes against the same refresh token.
    const results = await Promise.all(
      Array.from({ length: CONCURRENCY }, () => refreshSession(token.token)),
    );

    // ASSERT — every caller got a valid result (no 401, no logouts).
    expect(results).toHaveLength(CONCURRENCY);
    for (const r of results) {
      expect(r.accessToken).toBeTruthy();
      expect(r.refreshToken).toBeTruthy();
    }

    // All callers converge on the exact same new refresh token.
    const uniqueRefreshTokens = new Set(results.map((r) => r.refreshToken));
    expect(uniqueRefreshTokens.size).toBe(1);

    // DB contains exactly one unreplaced token for the user — the winner's row.
    const unreplaced = await testPrisma.refreshToken.findMany({
      where: { userId: user.id, replacedByRefreshId: null },
    });
    expect(unreplaced).toHaveLength(1);
    expect(unreplaced[0].token).toBe([...uniqueRefreshTokens][0]);

    // Old row is marked as replaced and points at the winner.
    const oldRow = await testPrisma.refreshToken.findUnique({
      where: { token: token.token },
    });
    expect(oldRow?.replacedByRefreshId).toBe(unreplaced[0].id);
  });
});
