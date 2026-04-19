import "server-only";

import crypto from "node:crypto";
import type { PrismaClient, User } from "@/db";
import { prisma as defaultPrisma } from "@/db";
import { UnauthorizedError } from "@/lib/server/error";
import type { IRateLimiter } from "@/lib/server/interfaces";
import { refreshLimiter as defaultRefreshLimiter } from "@/lib/server/providers/rate-limiters";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import {
  generateAccessToken,
  REFRESH_TOKEN_DURATION_IN_MS,
} from "@/lib/server/token";

interface RefreshSessionDeps {
  prisma: PrismaClient;
  refreshLimiter: IRateLimiter;
}

const defaultDeps: RefreshSessionDeps = {
  prisma: defaultPrisma,
  refreshLimiter: defaultRefreshLimiter,
};

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

// Grace window during which a just-rotated refresh token still returns its replacement
// instead of rejecting. This lets concurrent requests that race on the same token all
// converge on the same new pair without logging the user out.
const ROTATION_GRACE_MS = 30_000;

class RotationRaceLost extends Error {}

/**
 * Rotates the refresh token using an atomic UPDATE to serialize concurrent callers.
 * The winner of the race inserts the new row and points the old row at it. Losers
 * follow the pointer and return the same new pair, so all concurrent callers agree.
 * Throws on failure (missing token, expired, rate-limited, user not found).
 */
export async function refreshSession(
  currentRefreshToken: string,
  deps: RefreshSessionDeps = defaultDeps,
): Promise<RefreshResult> {
  const stored = await deps.prisma.refreshToken.findUnique({
    where: { token: currentRefreshToken },
  });

  if (!stored) {
    throw new UnauthorizedError("Refresh token expired");
  }

  if (stored.replacedByRefreshId) {
    return followReplacement(stored.userId, stored.replacedByRefreshId, deps);
  }

  if (stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired");
  }

  const limit = await deps.refreshLimiter.limit(
    `refresh:user:${stored.userId}`,
  );
  rateLimitOrThrow(limit);

  const user = await deps.prisma.user.findUnique({
    where: { id: stored.userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const newRefreshTokenValue = crypto.randomBytes(64).toString("base64");

  try {
    const newToken = await deps.prisma.$transaction(async (tx) => {
      const newRow = await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: newRefreshTokenValue,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION_IN_MS),
        },
      });

      const updated = await tx.refreshToken.updateMany({
        where: {
          id: stored.id,
          replacedByRefreshId: null,
          expiresAt: { gt: new Date() },
        },
        data: { replacedByRefreshId: newRow.id },
      });

      if (updated.count === 0) {
        throw new RotationRaceLost();
      }

      return newRow.token;
    });

    // Opportunistic cleanup — fire and forget, don't block the refresh.
    deps.prisma.refreshToken
      .deleteMany({
        where: {
          userId: user.id,
          OR: [
            { expiresAt: { lt: new Date() } },
            {
              replacedByRefreshId: { not: null },
              createdAt: { lt: new Date(Date.now() - ROTATION_GRACE_MS * 2) },
            },
          ],
        },
      })
      .catch(() => {});

    return {
      accessToken: await generateAccessToken(user),
      refreshToken: newToken,
    };
  } catch (error) {
    if (error instanceof RotationRaceLost) {
      const reread = await deps.prisma.refreshToken.findUnique({
        where: { id: stored.id },
      });
      if (!reread?.replacedByRefreshId) {
        throw new UnauthorizedError("Refresh token expired");
      }
      return followReplacement(user.id, reread.replacedByRefreshId, deps, user);
    }
    throw error;
  }
}

async function followReplacement(
  userId: string,
  replacementId: string,
  deps: RefreshSessionDeps,
  cachedUser?: User,
): Promise<RefreshResult> {
  const replacement = await deps.prisma.refreshToken.findUnique({
    where: { id: replacementId },
  });
  if (!replacement) {
    throw new UnauthorizedError("Refresh token expired");
  }

  if (Date.now() - replacement.createdAt.getTime() > ROTATION_GRACE_MS) {
    throw new UnauthorizedError("Refresh token expired");
  }

  const user =
    cachedUser ??
    (await deps.prisma.user.findUnique({ where: { id: userId } }));
  if (!user) {
    throw new Error("User not found");
  }

  return {
    accessToken: await generateAccessToken(user),
    refreshToken: replacement.token,
  };
}
