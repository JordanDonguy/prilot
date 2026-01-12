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

	// GitHub App
	GITHUB_APP_ID: z.string().min(1, "GITHUB_APP_ID is required"),
	GITHUB_APP_PRIVATE_KEY: z.string().min(1, "GITHUB_APP_PRIVATE_KEY is required"),

	// Groq
	GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is requried"),

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
		oauthRedirectUri: `${parsedEnv.FRONTEND_URL}/api/auth/github/callback`,
		appId: parsedEnv.GITHUB_APP_ID,
		appPrivateKey: parsedEnv.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
		redirectUri: `${parsedEnv.FRONTEND_URL}/login/github/callback`,
	},
	groq: {
		apiKey: parsedEnv.GROQ_API_KEY
	},
	frontendUrl: parsedEnv.FRONTEND_URL,
	nodeEnv: parsedEnv.NODE_ENV,
};
