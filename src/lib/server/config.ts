import "server-only";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  jwtSecret: requiredEnv("JWT_SECRET"),
};
