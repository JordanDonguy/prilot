import { TooManyRequestsError } from "@/lib/server/error";

type LimitResult = {
  success: boolean;
  reset: number;
};

export function rateLimitOrThrow(
  result: LimitResult,
  message = "Too many requests"
) {
  if (!result.success) {
    const retryAfter = Math.ceil(
      (result.reset - Date.now()) / 1000
    );

    throw new TooManyRequestsError(message, retryAfter);
  }
}
