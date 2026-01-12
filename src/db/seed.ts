import argon2 from "argon2";
import { getPrisma } from "./index.ts";

const prisma = getPrisma();

async function resetTables() {
	await prisma.pullRequest.deleteMany({});
	await prisma.repositoryMember.deleteMany({});
	await prisma.invitation.deleteMany({});
	await prisma.repository.deleteMany({});
	await prisma.providerInstallation.deleteMany({});
	await prisma.userOAuth.deleteMany({});
	await prisma.user.deleteMany({});
	console.log("🧹 Tables reset.");
}

async function main() {
	// Reset tables data
	await resetTables();

	// Create main dev user
	const user = await prisma.user.create({
		data: {
			id: "66f3bda6-9e72-41ec-aa44-927a339ffc5a",
			email: "dev@example.com",
			username: "devuser",
			password: await argon2.hash("SuperPassword1!"),
			oauthIds: {
				create: [
					{
						provider: "github",
						providerUserId: "123456",
					},
					{
						provider: "gitlab",
						providerUserId: "654321",
					},
				],
			},
		},
		include: {
			oauthIds: true,
		},
	});

	// Create installations for user
	const githubInstallation = await prisma.providerInstallation.create({
		data: {
			provider: "github",
			installationId: "inst-gh-1",
			accountLogin: "dev-gh",
			accountType: "user",
			createdBy: {
				connect: { id: user.id },
			},
		},
	});

	const gitlabInstallation = await prisma.providerInstallation.create({
		data: {
			provider: "gitlab",
			installationId: "inst-gl-1",
			accountLogin: "dev-gl",
			accountType: "user",
			createdBy: {
				connect: { id: user.id },
			},
		},
	});

	// Create repositories linked to installations
	const repos = await prisma.repository.createMany({
		data: [
			{
				provider: "github",
				providerRepoId: "gh-repo-1",
				owner: "dev-gh",
				name: "my-gh-repo",
				defaultBranch: "main",
				installationId: githubInstallation.id,
				isPrivate: true,
			},
			{
				provider: "gitlab",
				providerRepoId: "gl-repo-1",
				owner: "dev-gl",
				name: "my-gl-repo",
				defaultBranch: "main",
				installationId: gitlabInstallation.id,
				isPrivate: false,
			},
		],
	});

	// ⚠️ NEED TO FIX REPOS MEMBER IN SEED AND API ROUTE ⚠️
	const allRepos = await prisma.repository.findMany({});

	// Make dev user owner of their repos
	for (const repo of allRepos) {
		await prisma.repositoryMember.create({
			data: {
				repositoryId: repo.id,
				userId: user.id,
				role: "owner",
			},
		});

		// Create some Pull Requests for dev user
		await prisma.pullRequest.create({
			data: {
				repositoryId: repo.id,
				createdById: user.id,
				baseBranch: "main",
				compareBranch: "feature-1",
				language: "en",
				title: `Add feature for ${repo.name}`,
				description: `🧑‍💻 Created by **${repo.owner}** via YourApp\n\nSome PR description`,
			},
		});
	}

	// Second user
	const otherUser = await prisma.user.create({
		data: {
			id: "e45f90ed-b8f7-4a02-b8a6-3d722b379889",
			email: "other@example.com",
			username: "otheruser",
			oauthIds: {
				create: [
					{
						provider: "github",
						providerUserId: "789012",
					},
				],
			},
		},
		include: { oauthIds: true },
	});

	// Create installation for second user
	const otherInstallation = await prisma.providerInstallation.create({
		data: {
			provider: "github",
			installationId: "inst-gh-2",
			accountLogin: "other-gh",
			accountType: "user",
			createdBy: {
				connect: { id: otherUser.id },
			},
		},
	});

	// Second user repo
	const otherRepo = await prisma.repository.create({
		data: {
			provider: "github",
			providerRepoId: "gh-repo-2",
			owner: "other-gh",
			name: "other-user-repo",
			defaultBranch: "main",
			installationId: otherInstallation.id,
			isPrivate: true
		},
	});

	// Owner membership
	await prisma.repositoryMember.create({
		data: {
			repositoryId: otherRepo.id,
			userId: otherUser.id,
			role: "owner",
		},
	});

	// Invite dev user and add as member
	await prisma.invitation.create({
		data: {
			repositoryId: otherRepo.id,
			email: user.email,
			invitedById: otherUser.id,
			status: "accepted",
		},
	});

	await prisma.repositoryMember.create({
		data: {
			repositoryId: otherRepo.id,
			userId: user.id,
			role: "member",
		},
	});

	console.log("✅ Local dev data seeded.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
