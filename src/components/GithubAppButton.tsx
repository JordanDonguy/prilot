"use client";

import { CirclePlus } from "lucide-react";

interface GithubAppButtonProps {
	appName: string; // GitHub App name
	redirectUri?: string; // optional redirect after installation
}

export default function GithubAppButton({
	appName,
	redirectUri,
}: GithubAppButtonProps) {
	const handleConnect = () => {
		let url = `https://github.com/apps/${appName}/installations/new`;
		if (redirectUri) {
			url += `?redirect_uri=${encodeURIComponent(redirectUri)}`;
		}

		// open GitHub install page
		window.location.href = url;
	};

	return (
		<button
			type="button"
			onClick={handleConnect}
			className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mt-2 cursor-pointer hover:underline"
		>
			<CirclePlus size={16} /> Connect your account
		</button>
	);
}
