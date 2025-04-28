const htmlmin = require("html-minifier");
const crypto = require("crypto-js");
const fs = require("fs");
const path = require("path");

// Generate a hash of the CSS file content
function getFileHash(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		return crypto.MD5(content).toString().substring(0, 8);
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error);
		return Date.now().toString();
	}
}

// Get the hash of the CSS file
const cssHash = getFileHash(path.join(__dirname, "styles", "tailwind.css"));

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
		"./node_modules/alpinejs/dist/cdn.min.js": "./js/alpine.js",
	});

	eleventyConfig.addShortcode("version", () => cssHash);

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
