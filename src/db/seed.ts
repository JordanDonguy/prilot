// prisma/seed.ts
import { getPrisma } from "./index.ts";
import argon2 from "argon2";

const prisma = getPrisma();

async function resetTables() {
  await prisma.pullRequest.deleteMany({});
  await prisma.repositoryMember.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.repository.deleteMany({});
  await prisma.providerAccount.deleteMany({});
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
			password: await argon2.hash("SuperPassword1!"),
      providerAccounts: {
        create: [
          {
            provider: "github",
            providerUserId: "123456",
            username: "dev-gh",
            accessToken: "FAKE_GH_TOKEN",
          },
          {
            provider: "gitlab",
            providerUserId: "654321",
            username: "dev-gl",
            accessToken: "FAKE_GL_TOKEN",
          },
        ],
      },
      repositories: {
        create: [
          {
            provider: "github",
            providerRepoId: "gh-repo-1",
            owner: "dev-gh",
            name: "my-gh-repo",
            defaultBranch: "main",
          },
          {
            provider: "gitlab",
            providerRepoId: "gl-repo-1",
            owner: "dev-gl",
            name: "my-gl-repo",
            defaultBranch: "main",
          },
        ],
      },
    },
    include: {
      providerAccounts: true,
      repositories: true,
    },
  });

  // Make dev user owner of their repos
  for (const repo of user.repositories) {
    await prisma.repositoryMember.create({
      data: {
        repositoryId: repo.id,
        userId: user.id,
        role: "owner",
      },
    });
  }

  // Create some Pull Requests for dev user
  for (const repo of user.repositories) {
    const account =
      repo.provider === "github"
        ? user.providerAccounts.find((a) => a.provider === "github")!
        : user.providerAccounts.find((a) => a.provider === "gitlab")!;

    await prisma.pullRequest.create({
      data: {
        repositoryId: repo.id,
        createdById: user.id,
        providerAccountId: account.id,
        baseBranch: "main",
        compareBranch: "feature-1",
        language: "en",
        title: `Add feature for ${repo.name}`,
        description: "Some PR description",
      },
    });
  }

  // Create second user (repo owner)
  const otherUser = await prisma.user.create({
    data: {
      id: "e45f90ed-b8f7-4a02-b8a6-3d722b379889",
      email: "other@example.com",
      providerAccounts: {
        create: [
          {
            provider: "github",
            providerUserId: "789012",
            username: "other-gh",
            accessToken: "FAKE_GH_TOKEN_2",
          },
        ],
      },
    },
    include: {
      providerAccounts: true,
    },
  });

  // Second user creates a new repo
  const otherRepo = await prisma.repository.create({
    data: {
      provider: "github",
      providerRepoId: "gh-repo-2",
      owner: "other-gh",
      name: "other-user-repo",
      defaultBranch: "main",
      createdById: otherUser.id,
    },
  });

  // Make second user owner
  await prisma.repositoryMember.create({
    data: {
      repositoryId: otherRepo.id,
      userId: otherUser.id,
      role: "owner",
    },
  });

  // Invite dev user to the repo and add them as member
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
