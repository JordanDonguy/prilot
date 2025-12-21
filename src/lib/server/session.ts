import { extractAccessToken, decodeJWT } from "./token";
import { getPrisma } from "@/db";

const prisma = getPrisma();

export async function getCurrentUser() {
  try {
    const token = await extractAccessToken();
    const payload = decodeJWT(token);

    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}
