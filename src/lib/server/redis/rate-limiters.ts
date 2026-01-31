import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./client";

// ---- Auth ----
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

// ---- AI ----
export const aiLimiterPerMinute = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export const aiLimiterPerDay = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 d"),
});

// ---- GitHub ----
export const githubLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
});

// ---- Email ----
export const inviteEmailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});
