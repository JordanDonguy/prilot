import { ChevronDown } from "lucide-react";

// ---------------------------
// ------ Branch Select ------
// ---------------------------
type BranchSelectProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
};

export function BranchSelect({
	label,
	value,
	onChange,
	options,
}: BranchSelectProps) {
	return (
		<div className="space-y-2 flex flex-col sm:items-center w-full">
			<label htmlFor={label} className="text-lg">
				{label}
			</label>

			<div className="w-full relative">
				<select
					value={value}
					name={label}
					onChange={(e) => onChange(e.target.value)}
					className="w-full p-2 rounded-lg bg-white/70 dark:bg-gray-800/70
            appearance-none shadow-sm hover:cursor-pointer hover:opacity-80
            transition-colors focus:outline-none"
				>
					{options.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>

				<ChevronDown className="pointer-events-none absolute h-full inset-y-0 right-4 text-gray-500 dark:text-gray-400" />
			</div>
		</div>
	);
}

// ----------------------------
// ---- Member Role Select ----
// ----------------------------
type MemberRoleSelectProps = {
	value?: string;
	onChange: (value: "admin" | "member") => void;
};

export function MemberRoleSelect({
	value = "member",
	onChange,
}: MemberRoleSelectProps) {
	const isAdmin = value === "admin";

	return (
		<div className="relative hover:cursor-pointer transition-colors">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value as "admin" | "member")}
				className={`text-sm py-2 pr-10 pl-4 rounded-lg appearance-none
          shadow-sm hover:cursor-pointer hover:opacity-85 focus:outline-none transition-colors
          ${
						isAdmin
							? "bg-gray-900 text-white dark:bg-gray-200 dark:text-black"
							: "bg-gray-300 dark:bg-gray-800/70"
					}`}
			>
				<option value="admin">Admin</option>
				<option value="member">Member</option>
			</select>

			<ChevronDown
				className={`pointer-events-none absolute h-full inset-y-0 right-2
          ${
						isAdmin
							? "text-gray-200 dark:text-gray-700"
							: "text-gray-500 dark:text-gray-400"
					}`}
			/>
		</div>
	);
}

// ---------------------------
// ----- Language Select -----
// ---------------------------
type Language = "english" | "spanish" | "french" | "german";

type LanguageSelectProps = {
	value?: Language;
	onChange?: (value: Language) => void;
	className?: string;
};

export function LanguageSelect({
	value,
	onChange,
	className = "",
}: LanguageSelectProps) {
	const languages: Language[] = ["english", "spanish", "french", "german"];

	return (
		<div className={`space-y-2 flex flex-col items-end ${className}`}>
			<label htmlFor="language">Language</label>
			<div className="relative">
				<select
					id="language"
					value={value}
					onChange={(e) => onChange?.(e.target.value as Language)}
					className="py-2 pr-10 pl-4 rounded-lg bg-white/70 dark:bg-gray-800/70
              appearance-none text-start shadow-sm hover:cursor-pointer hover:opacity-80
              focus:outline-none transition-colors"
				>
					{languages.map((lang) => (
						<option key={lang} value={lang}>
							{lang.charAt(0).toUpperCase() + lang.slice(1)}
						</option>
					))}
				</select>
				<ChevronDown className="pointer-events-none absolute h-full inset-y-0 right-2 text-gray-500 dark:text-gray-400" />
			</div>
		</div>
	);
}
