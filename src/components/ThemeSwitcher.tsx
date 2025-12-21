"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeSwitcherProps = {
	/** Extra Tailwind/CSS classes for the button */
	className?: string;
	/** Optional text to display next to the icon */
	showText?: boolean;
	/* Icons size, default to 24 */
	size?: number;
};

export default function ThemeSwitcher({
	className = "",
	showText = false,
	size = 24,
}: ThemeSwitcherProps) {
	const { resolvedTheme, setTheme } = useTheme();

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={`flex items-center justify-center gap-2 rounded-full p-2
				hover:cursor-pointer transition-colors ${className}`}
			aria-label="Toggle theme"
		>
			{isDark ? (
				<Moon className={`${showText && "absolute ml-2"}`} size={size} />
			) : (
				<Sun size={size} className={`${showText && "absolute ml-2"}`} />
			)}

			{showText && (
				<span className="mx-auto w-full">
					{showText && `${isDark ? "Thème (dark)" : "Thème (light)"}`}
				</span>
			)}
		</button>
	);
}
