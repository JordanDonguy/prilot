import { TooManyRequestsError } from "@/lib/server/error";
import { formatMinutesSeconds } from "@/lib/utils/formatDateTime";

type LimitResult = {
	success: boolean;
	reset: number; // timestamp when window resets
	remaining: number; // remaining requests in current window
};

export function rateLimitOrThrow(result: LimitResult, message?: string) {
	if (!result.success) {
		const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

		throw new TooManyRequestsError(
			message ??
				`Too many requests... Please try again in ${formatMinutesSeconds(retryAfter)}.`,
		);
	}

	// Return metadata for frontend usage
	return {
		remaining: result.remaining,
		reset: result.reset,
	};
}
