import { z } from "zod";

export const branchSchema = z
  .string()
  .min(1, "Branch name cannot be empty")
  .max(255, "Branch name too long")
