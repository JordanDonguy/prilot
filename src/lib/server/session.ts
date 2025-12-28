import { extractAccessToken, decodeJWT } from "./token";
import { getPrisma } from "@/db";

const prisma = getPrisma();

export async function getCurrentUser() {
  try {
    const token = await extractAccessToken();
    const payload = decodeJWT(token);

    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { oauthIds: true }, // include OAuth associations
    });

    if (!user) return null;

    // Remove password and map oauthIds
    const { password, oauthIds, ...safeUser } = user;
    const oauthProviders = oauthIds.map((o) => ({
      provider: o.provider,
      username: o.username,
    }));

    return {
      ...safeUser,
      oauthProviders,
    };
  } catch {
    return null;
  }
}
