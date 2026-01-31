import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError, TooManyRequestsError } from "./error";

export function handleError(error: unknown) {
	// Zod
	if (error instanceof ZodError) {
		console.info(error);
		return NextResponse.json({ error: error.flatten() }, { status: 422 });
	}

	// Rate limit (needs Retry-After)
	if (error instanceof TooManyRequestsError) {
		console.info(error);
		return NextResponse.json(
			{ error: error.message },
			{
				status: 429,
				headers: error.retryAfter
					? { "Retry-After": error.retryAfter.toString() }
					: undefined,
			},
		);
	}

	// Custom HTTP error
	if (error instanceof HttpError) {
		console.info(error);
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);
	}

	// Unknown
	console.error(error);
	return NextResponse.json(
		{ error: "Unexpected server error" },
		{ status: 500 },
	);
}
