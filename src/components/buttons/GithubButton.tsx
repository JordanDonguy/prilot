import { Github } from "lucide-react";

export default function GithubButton() {
	const handleGitHubLogin = () => {
		// Redirect the browser to the GitHub OAuth start route
		window.location.href = "/api/auth/github/start";
	};

	return (
		<button
			type="button"
			onClick={handleGitHubLogin}
			className="flex w-full md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
		>
			<Github className="w-5 h-5" />
			GitHub
		</button>
	);
}
