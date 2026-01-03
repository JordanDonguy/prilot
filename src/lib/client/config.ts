import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_GITHUB_APP_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_GITHUB_APP_NAME is required"),
  NEXT_PUBLIC_FRONTEND_URL: z
    .string()
    .url("NEXT_PUBLIC_FRONTEND_URL must be a valid URL"),
});

const parsedEnv = envSchema.parse({
  NEXT_PUBLIC_GITHUB_APP_NAME: process.env.NEXT_PUBLIC_GITHUB_APP_NAME,
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
});

export const config = {
  github: {
    appName: parsedEnv.NEXT_PUBLIC_GITHUB_APP_NAME,
  },
  frontendUrl: parsedEnv.NEXT_PUBLIC_FRONTEND_URL,
};
