/** @type {import('next').NextConfig} */
const nextConfig = {
	//output: "export",
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		nextScriptWorkers: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
		dirs: ["src"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "mpop-prod-hls-primary.s3.amazonaws.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "wadesplumbingandseptic.byronw35.sg-host.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "abuqrtstxqryqcvsohkz.supabase.co",
				pathname: "**",
			},
		],
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Enable source maps in production
		if (!dev) {
			config.devtool = "source-map";
		}

		// Important: return the modified config
		return config;
	},
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
	module.exports,
	{
		// For all available options, see:
		// https://github.com/getsentry/sentry-webpack-plugin#options

		// Suppresses source map uploading logs during build
		silent: true,
		org: "byronwade",
		project: "wadesplumbingandseptic",
	},
	{
		// For all available options, see:
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

		// Upload a larger set of source maps for prettier stack traces (increases build time)
		widenClientFileUpload: true,

		// Transpiles SDK to be compatible with IE11 (increases bundle size)
		transpileClientSDK: true,

		// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
		tunnelRoute: "/monitoring",

		// Hides source maps from generated client bundles
		hideSourceMaps: true,

		// Automatically tree-shake Sentry logger statements to reduce bundle size
		disableLogger: true,
	}
);
  