import AnimatedOpacity from "@/components/animations/AnimatedOpacity";
import AnimatedScale from "@/components/animations/AnimatedScale";
import AnimatedSlide from "@/components/animations/AnimatedSlide";
import LandingCTA from "@/components/landing/LandingCTA";

export default function CTASection() {
	return (
		<section className="py-20 bg-linear-to-r from-cyan-400 to-blue-500 dark:from-cyan-800 dark:to-blue-800">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<AnimatedSlide y={-20} triggerOnView>
					<h2 className="text-4xl md:text-5xl mb-6 text-white font-bold">
						Stop writing PR descriptions by hand.
					</h2>
					<p className="text-xl mb-8 text-blue-100">
						Set up in 2 minutes. Install the GitHub App, pick your branches, and
						let PRilot handle the rest.
					</p>
				</AnimatedSlide>

				<AnimatedScale scale={0.9} triggerOnView>
					<LandingCTA animated={false} variant="white" />
				</AnimatedScale>

				{/* Trust indicators */}
				<AnimatedOpacity delay={0.3}>
					<div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-blue-100/80">
						<span>Deep code analysis</span>
						<span className="hidden sm:inline">&mdash;</span>
						<span>Structured and standardised PRs</span>
						<span className="hidden sm:inline">&mdash;</span>
						<span>One-click send to GitHub</span>
					</div>
				</AnimatedOpacity>
			</div>
		</section>
	);
}
