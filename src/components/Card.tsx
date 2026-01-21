import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import AnimatedScale from "./animations/AnimatedScale";

interface CardProps {
	children: ReactNode;
	className?: string;
	animatedSlideXValue?: number;
}

export function Card({ children, className = "" }: CardProps) {
	return <div className={`rounded-xl p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardProps) {
	return (
		<div className={`mb-2 font-bold text-lg ${className}`}>{children}</div>
	);
}

export function CardTitle({ children, className = "" }: CardProps) {
	return <h4 className={`text-lg font-semibold ${className}`}>{children}</h4>;
}

export function CardDescription({ children, className = "" }: CardProps) {
	return (
		<p className={`text-gray-600 dark:text-gray-400 ${className}`}>
			{children}
		</p>
	);
}

export function CardContent({ children, className = "" }: CardProps) {
	return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
	return (
		<div className={`mt-2 text-sm text-gray-500 ${className}`}>{children}</div>
	);
}

export function CardAction({ children, className = "" }: CardProps) {
	return <div className={`mt-2 ${className}`}>{children}</div>;
}

type StatCardProps = {
	title: string;
	value: number | string;
	icon: LucideIcon;
	comment?: string;
};

export function StatCard({ title, value, icon: Icon, comment }: StatCardProps) {
	return (
		<AnimatedScale scale={0.9} triggerOnView={false}>
			<Card className="bg-white/70 dark:bg-gray-800/25 border backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm">{title}</CardTitle>
					<Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl">{value}</div>
				</CardContent>
				{comment && (
					<p className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
						{comment}
					</p>
				)}
			</Card>
		</AnimatedScale>
	);
}
