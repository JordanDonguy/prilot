import { NextResponse } from "next/server";
import { getPrisma, InvitationStatus } from "@/db";
import { uuidParam } from "@/lib/schemas/id.schema";
import { ForbiddenError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

interface RepoMemberOrInvite {
  id: string;
  username?: string;
  email: string;
  role?: string | null;
  createdAt: Date;
  status?: InvitationStatus;   // only for invitations
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ repoId: string }> }
) {
  try {
    // 1. Find logged-in user
    const user = await getCurrentUser();
    if (!user) throw new ForbiddenError("Unauthorized");

    // 2. Parse and validate repoId
    const { repoId } = await uuidParam("repoId").parseAsync(await context.params);

    // 3. Ensure user is a member of the repo
    const isMember = await prisma.repositoryMember.findFirst({
      where: { repositoryId: repoId, userId: user.id },
    });
    if (!isMember) throw new ForbiddenError("You do not have access to this repository");

    // 4. Fetch repository members
    const members = await prisma.repositoryMember.findMany({
      where: { repositoryId: repoId },
      include: { user: true },
    });

    // 5. Fetch pending invitations
    const invitations = await prisma.invitation.findMany({
      where: { repositoryId: repoId, status: "pending" },
    });

    // 6. Format members and invitations
    const combined: RepoMemberOrInvite[] = [
      ...members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        email: m.user.email,
        role: m.role,
        createdAt: m.createdAt,
      })),
      ...invitations.map((i) => ({
        id: i.id,
        email: i.email,
        role: null,
        createdAt: i.createdAt,
        status: InvitationStatus.pending,
      })),
    ];

    return NextResponse.json({ members: combined });
  } catch (error) {
    return handleError(error);
  }
}
