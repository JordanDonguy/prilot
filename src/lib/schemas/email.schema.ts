import { z } from "zod";

export const emailSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});
