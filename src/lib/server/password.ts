import "server-only";

import argon2 from "argon2";
import { BadRequestError } from "./error";

// ----------------------------
// Hash a password using argon2
// ----------------------------
export async function hashPassword(password: string) {
	return argon2.hash(password);
}

// ----------------------------------
// Verify hashed password and new one
// ----------------------------------
export async function verifyPassword(hashed: string, plain: string, errorMessage?: string) {
	const isMatching = await argon2.verify(hashed, plain);
	if (!isMatching) {
		throw new BadRequestError(errorMessage || "Email and password do not match");
	}
}
