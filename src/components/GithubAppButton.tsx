"use client";

import { CircleCheck, CirclePlus, Github, PlugZap } from "lucide-react";

interface GithubAppButtonProps {
	appName: string;
	redirectUri?: string;
	variant?: "default" | "settings";
	connected?: boolean;
	className?: string;
}

export default function GithubAppButton({
	appName,
	redirectUri,
	variant = "default",
	connected = false,
	className,
}: GithubAppButtonProps) {
	const handleConnect = () => {
		let url = `https://github.com/apps/${appName}/installations/new`;
		if (redirectUri) {
			url += `?redirect_uri=${encodeURIComponent(redirectUri)}`;
		}

		window.location.href = url;
	};

	if (variant === "settings") {
		return (
			<div className={`flex flex-col gap-4 ${className ?? ""}`}>
				<div className="flex items-center gap-3">
					<Github />
					<span>GitHub</span>
				</div>

				{connected ? (
					<span className="h-10 flex justify-center items-center gap-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
						<CircleCheck size={20} className="text-green-600 dark:text-green-500" />
						Connected
					</span>
				) : (
					<button
						type="button"
						onClick={handleConnect}
						className="flex justify-center items-center gap-2 h-10 px-3 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:cursor-pointer hover:opacity-90"
					>
						<PlugZap size={20} />
						Connect
					</button>
				)}
			</div>
		);
	}

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
