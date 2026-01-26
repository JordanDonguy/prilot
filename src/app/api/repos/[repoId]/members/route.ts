import { NextResponse } from "next/server";
import { getPrisma, InvitationStatus } from "@/db";
import { uuidParam } from "@/lib/schemas/id.schema";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { sendMemberLeftEmail } from "@/lib/server/resend/emails/memberLeft";
import { sendMemberRemovedEmail } from "@/lib/server/resend/emails/memberRemoved";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

interface RepoMemberOrInvite {
	id: string;
	username?: string;
	email: string;
	role?: string | null;
	createdAt: Date;
	status?: InvitationStatus; // only for invitations
}

// =======================================
// GET all members and pending invitations
// =======================================
export async function GET(
	_req: Request,
	context: { params: Promise<{ repoId: string }> },
) {
	try {
		// 1. Find logged-in user
		const user = await getCurrentUser();
		if (!user) throw new ForbiddenError("Unauthorized");

		// 2. Parse and validate repoId
		const { repoId } = await uuidParam("repoId").parseAsync(
			await context.params,
		);

		// 3. Ensure user is a member of the repo
		const isMember = await prisma.repositoryMember.findFirst({
			where: { repositoryId: repoId, userId: user.id },
		});
		if (!isMember)
			throw new ForbiddenError("You do not have access to this repository");

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

// ===================================
// DELETE a member from the repository
// ===================================
export async function DELETE(
	req: Request,
	context: { params: Promise<{ repoId: string }> },
) {
	try {
    // 1. Get current user and validate params/body
		const currentUser = await getCurrentUser();
		if (!currentUser) throw new ForbiddenError("Unauthorized");

		const { repoId } = await uuidParam("repoId").parseAsync(
			await context.params,
		);
		const { userId: targetUserId } = await uuidParam("userId").parseAsync(
			await req.json(),
		);

		// 2. Find member record of target user
		const targetUser = targetUserId || currentUser.id;
		const member = await prisma.repositoryMember.findFirst({
			where: { repositoryId: repoId, userId: targetUser },
			include: { user: true },
		});
		if (!member) throw new NotFoundError("Member not found");

		// 3. Determine if currentUser is owner
		const currentUserMembership = await prisma.repositoryMember.findFirst({
			where: { repositoryId: repoId, userId: currentUser.id },
		});
		const isOwner = currentUserMembership?.role === "owner";

		// 4. Authorization
		if (targetUser !== currentUser.id && !isOwner) {
			throw new ForbiddenError("Only owners can remove other members");
		}

		// 5. Prevent owner from removing themselves
		if (member.userId === currentUser.id && isOwner) {
			throw new BadRequestError("Owners cannot remove themselves");
		}

		// 6. Delete membership
		await prisma.repositoryMember.delete({ where: { id: member.id } });

		// 7. Fetch repository name
		const repo = await prisma.repository.findFirst({
			where: { id: repoId },
			select: { name: true },
		});

		// 8. Send email
		if (targetUser === currentUser.id) {
			// Member left voluntarily
			await sendMemberLeftEmail({
				to: member.user.email,
				repoName: repo?.name ?? "",
				username: currentUser.username,
			});
		} else {
			// Owner removed member
			await sendMemberRemovedEmail({
				to: member.user.email,
				repoName: repo?.name ?? "",
				removedBy: currentUser.username,
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		return handleError(error);
	}
}
