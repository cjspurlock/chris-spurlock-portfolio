const htmlmin = require("html-minifier");

const now = String(Date.now());

module.exports = (eleventyConfig) => {
	eleventyConfig.addWatchTarget("./styles/tailwind.config.js");
	eleventyConfig.addWatchTarget("./styles/tailwind.css");

	// Pass images directory through to the _site folder
	eleventyConfig.addPassthroughCopy("images");

	// Pass assets directory through to the _site folder
	eleventyConfig.addPassthroughCopy("assets");

	// Pass fonts directory through to the _site folder
	eleventyConfig.addPassthroughCopy("fonts");

	eleventyConfig.addPassthroughCopy({
		"./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
	});

	eleventyConfig.addShortcode("version", () => now);

	eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
		if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith(".html")) {
			const minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}

		return content;
	});

	// Copy `robots.txt` to the output directory
	eleventyConfig.addPassthroughCopy("robots.txt");
};
