"use client";

import { motion, type Variants } from "framer-motion";

type AnimatedScaleProps = {
	children: React.ReactNode;
	className?: string;
	/** Spring settings */
	damping?: number;
	mass?: number;
	stiffness?: number;
	/** Optional delay */
	delay?: number;
	/** Trigger only when in view */
	triggerOnView?: boolean;
	/* Optionnal scale value, default to 0 */
	scale?: number;
};

export default function AnimatedScale({
	children,
	className = "",
	damping = 10,
	mass = 1,
	stiffness = 150,
	delay = 0,
	triggerOnView,
	scale = 0,
}: AnimatedScaleProps) {
	const variants: Variants = {
		hidden: {
			scale: scale,
			rotate: 0,
		},
		visible: {
			scale: 1,
			transition: {
				type: "spring",
				damping,
				mass,
				stiffness,
				delay,
			},
		},
	};

	const motionProps = triggerOnView
		? { whileInView: "visible", viewport: { once: true } }
		: { animate: "visible" };

	return (
		<motion.div
			className={className}
			variants={variants}
			initial="hidden"
			{...motionProps}
		>
			{children}
		</motion.div>
	);
}
