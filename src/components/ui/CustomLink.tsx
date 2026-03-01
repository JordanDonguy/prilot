import Link from "next/link";

export const CustomLink = ({ className = "", href = "/", ...props }) => {
	return (
		<Link
			href={href}
			className={`w-28 h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 ${className}`}
			{...props}
		/>
	);
};
