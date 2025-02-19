"use client";

import dynamic from "next/dynamic";

// Loading component
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;

// Dynamic imports for non-critical components
const Step = dynamic(() => import("@/components/sections/Step"), {
	loading: () => <LoadingPulse className="h-[400px]" />,
});

const FAQ = dynamic(() => import("@/components/sections/FAQ"), {
	loading: () => <LoadingPulse className="h-[400px]" />,
});

const LogoCloud = dynamic(() => import("@/components/sections/LogoCloud"), {
	loading: () => <LoadingPulse className="h-[200px]" />,
});

const DynamicTestimonials = dynamic(() => import("@/components/sections/Testimonials"), {
	loading: () => <LoadingPulse className="h-[500px]" />,
});

const StatsSection = dynamic(() => import("@/components/sections/StatsSection"), {
	loading: () => <LoadingPulse className="h-[300px]" />,
});

export default function DynamicSections() {
	return (
		<>
			<Step />
			<FAQ />
			<LogoCloud />
			<DynamicTestimonials />
			<StatsSection />
		</>
	);
}
