import z from "zod";

export const passwordValidationSchema = z
	.string()
	.min(8, "password should contain at least 8 caracters")
	.regex(/[a-z]/, "password should contain at least one lowercased letter")
	.regex(/[A-Z]/, "password should contain at least one uppercased letter")
	.regex(/[0-9]/, "password should contain at least one digit")
	.regex(
		/[!@#$%^&*_-]/,
		"password should contain at least one of these special caracter: ! @ # $ % ^ & * _ -",
	);

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export const signupSchema = z.object({
	email: z.email(),
	username: z.string().min(2).max(30),
	password: passwordValidationSchema,
	confirmPassword: passwordValidationSchema,
});
