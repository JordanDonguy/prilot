import { z } from "zod";

// 1. Helper to create a UUID schema with any key
export const uuidParam = <T extends string>(key: T) =>
	z.object({
		[key]: z.uuid("ID needs to be a valid uuid"),
	});
