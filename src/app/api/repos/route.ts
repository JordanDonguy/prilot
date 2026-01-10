import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { UnauthorizedError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError("Unauthenticated");

    // 1. Fetch repositories where user is a member
    const repositories = await prisma.repository.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        provider: true,
        owner: true,
        name: true,
        defaultBranch: true,
        installationId: true,
        createdAt: true,
				isPrivate: true,
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
        _count: {
          select: {
            pullRequests: true,
          },
        },
        pullRequests: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. Map repositories to include PR counts and user role
    const result = repositories.map((repo) => {
      const userRole = repo.members.find((m) => m.userId === user.id)?.role ?? null;

      const draftPrCount = repo.pullRequests.filter((pr) => pr.status === "draft").length;
      const sentPrCount = repo.pullRequests.filter((pr) => pr.status === "sent").length;

      return {
        id: repo.id,
        name: repo.name,
        provider: repo.provider,
        owner: repo.owner,
        defaultBranch: repo.defaultBranch,
        installationId: repo.installationId,
        createdAt: repo.createdAt,
				isPrivate: repo.isPrivate,
        userRole,
        draftPrCount,
        sentPrCount,
      };
    });

    return NextResponse.json({ repositories: result });
  } catch (error) {
    return handleError(error);
  }
}
