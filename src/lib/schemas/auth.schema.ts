import z from "zod";

const PASSWORD_MESSAGE =
	"Password should contain at least 8 characters, one lowercase, one uppercase, one digit, and one of these special characters: !, @, #, $, %, ^, &, *, _, -";

export const passwordValidationSchema = z
	.string()
	.refine(
		(val) =>
			val.length >= 8 &&
			/[a-z]/.test(val) &&
			/[A-Z]/.test(val) &&
			/[0-9]/.test(val) &&
			/[!@#$%^&*_-]/.test(val),
		{ message: PASSWORD_MESSAGE },
	);

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export const signupSchema = z.object({
	email: z.email(),
	username: z.string().min(2).max(30),
	password: passwordValidationSchema,
	confirmPassword: z.string(),
});

export const changePasswordSchema = z.object({
	currentPassword: z.string(),
	newPassword: passwordValidationSchema,
	confirmPassword: z.string(),
});

export const setPasswordSchema = z.object({
	password: passwordValidationSchema,
	confirmPassword: z.string(),
});

export const resetPasswordSchema = z.object({
	token: z.string().min(64).max(64),
	password: passwordValidationSchema,
	confirmPassword: z.string(),
});
