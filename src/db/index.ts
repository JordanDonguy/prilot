import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { config } from "../lib/server/config.ts";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: config.db.url,
    });

    prisma = new PrismaClient({ adapter });
  }

  return prisma;
}

export * from "../generated/prisma/client.ts";
