/**
 * Extract the client IP from a Next.js Request.
 * Works for standard deployments (Vercel, custom server).
 *
 * Priority:
 * 1. X-Forwarded-For header (common in proxies / Vercel)
 * 2. request.ip (Node-only)
 *
 * Returns "unknown" if it can't be determined.
 */

export function getClientIp(req: Request): string {
	// 1. Check X-Forwarded-For (may contain multiple IPs)
	const xForwardedFor = req.headers.get("x-forwarded-for");
	if (xForwardedFor) {
		// Take first IP in the list
		const ips = xForwardedFor.split(",").map((ip) => ip.trim());
		if (ips.length > 0 && ips[0]) return ips[0];
	}

	// 2. Fallback: req.socket.remoteAddress (Node only)
	// This works if running in Node, not in Edge
	const socketReq = req as unknown as { socket?: { remoteAddress?: string } };
	const socketAddress = socketReq.socket?.remoteAddress;
	if (socketAddress) return socketAddress;

	// 3. Unknown
	return "unknown";
}
