/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		nextScriptWorkers: true,
	},
	images: {
		domains: ["wadesplumbingandseptic.byronw35.sg-host.com", "146.190.186.245", "lh3.googleusercontent.com", "images.unsplash.com", "abuqrtstxqryqcvsohkz.supabase.co"],
	},
};

module.exports = nextConfig;
