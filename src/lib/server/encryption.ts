import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { config } from "./config";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// Derive a 32-byte key from JWT_SECRET
const encryptionKey = createHash("sha256")
	.update(config.jwt.secret)
	.digest();

export function encrypt(plaintext: string): string {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, encryptionKey, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});

	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	// Format: base64(iv + authTag + ciphertext)
	return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(encoded: string): string {
	const buffer = Buffer.from(encoded, "base64");

	const iv = buffer.subarray(0, IV_LENGTH);
	const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
	const ciphertext = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

	const decipher = createDecipheriv(ALGORITHM, encryptionKey, iv, {
		authTagLength: AUTH_TAG_LENGTH,
	});
	decipher.setAuthTag(authTag);

	return decipher.update(ciphertext) + decipher.final("utf8");
}
