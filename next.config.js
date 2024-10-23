/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
  