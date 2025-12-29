import { z } from "zod";

const envSchema = z.object({
	// Database
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

	// JWT
	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

	// GitHub OAuth
	GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
	GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),

	// Frontend
	FRONTEND_URL: z.url("FRONTEND_URL must be a valid URL"),

	// Node environment
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const parsedEnv = envSchema.parse(process.env);

export const config = {
	db: {
		url: parsedEnv.DATABASE_URL,
	},
	jwt: {
		secret: parsedEnv.JWT_SECRET,
	},
	github: {
		clientId: parsedEnv.GITHUB_CLIENT_ID,
		clientSecret: parsedEnv.GITHUB_CLIENT_SECRET,
		redirectUri: `${parsedEnv.FRONTEND_URL}/login/github/callback`,
	},
	frontendUrl: parsedEnv.FRONTEND_URL,
	nodeEnv: parsedEnv.NODE_ENV,
};
