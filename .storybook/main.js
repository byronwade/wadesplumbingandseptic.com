const path = require("path");
import "@storybook/addon-console";

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-styling-webpack", "@storybook/addon-themes", "@storybook/addon-a11y", "@storybook/addon-controls", "@storybook/addon-docs", "@storybook/addon-viewport"],

	webpackFinal: async (config) => {
		config.module.rules.push({
			test: /\.css$/,
			use: [
				{
					loader: "postcss-loader",
					options: {
						postcssOptions: {
							plugins: [require("tailwindcss"), require("autoprefixer")],
						},
					},
				},
			],
			include: path.resolve(__dirname, "../"),
		});

		return config;
	},

	framework: {
		name: "@storybook/nextjs",
		options: {},
	},

	docs: {
		autodocs: true,
	},
};
