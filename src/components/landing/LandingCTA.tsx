import { CustomLink } from "@/components/CustomLink";

export default function LandingCTA({
	animated = true,
	variant = "gradient",
}: {
	animated?: boolean;
	variant?: "gradient" | "white";
}) {
	return (
		<CustomLink
			href="/dashboard"
			className={`w-40 
				${
					variant === "gradient"
						? "bg-linear-to-r from-cyan-50 dark:from-gray-900 to-blue-200 dark:to-blue-900 border border-cyan-300 dark:border-cyan-800 hover:to-blue-400 hover:dark:to-blue-700 transition-colors"
						: "bg-white text-blue-800 hover:opacity-80 transition"
				} 
				${animated ? "animate-bounce" : ""}`}
		>
			Get started now
		</CustomLink>
	);
}
