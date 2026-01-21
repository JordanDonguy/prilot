"use client";

import { motion, type Variants } from "framer-motion";

type AnimatedSlideProps = {
	children: React.ReactNode;
	/** Initial slide offset on X axis. Optional. */
	x?: number;
	/** Initial slide offset on Y axis. Optional. */
	y?: number;
	/** Spring stiffness/damping settings */
	damping?: number;
	mass?: number;
	/** Trigger only when in view */
	triggerOnView?: boolean;
	/** Amount of visible view to trigger effect */
	amount?: number;
	/** Additional className */
	className?: string;
	/* Optionnal ref */
	ref?: React.RefObject<HTMLDivElement | null>;
};

export default function AnimatedSlide({
	children,
	x = 0,
	y = 0,
	damping = 18,
	mass = 0.5,
	triggerOnView,
	amount = 0.5,
	className = "",
	ref,
}: AnimatedSlideProps) {
	const variants: Variants = {
		hidden: {
			x: x,
			y,
		},
		visible: {
			x: 0,
			y: 0,
			transition: {
				type: "spring",
				damping,
				mass,
			},
		},
	};

	const motionProps = triggerOnView
		? { whileInView: "visible", viewport: { once: true, amount } }
		: { animate: "visible" };

	return (
		<motion.div
			ref={ref}
			className={className}
			variants={variants}
			initial="hidden"
			{...motionProps}
		>
			{children}
		</motion.div>
	);
}
