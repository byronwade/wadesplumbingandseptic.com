/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["wadesplumbingandseptic.byronw35.sg-host.com", "lh3.googleusercontent.com", "images.unsplash.com", "abuqrtstxqryqcvsohkz.supabase.co"],
	},
};

module.exports = nextConfig;
