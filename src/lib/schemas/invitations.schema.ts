import { z } from "zod";

export const invitationTokenSchema = z.object({
	token: z
		.string("Invalid token")
		.min(64, "Invalid token length")
		.max(64, "Invalid token length"),
});
