const htmlmin = require("html-minifier");
const crypto = require("crypto-js");
const fs = require("fs");
const path = require("path");

// Generate a hash of a file's content
function getFileHash(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		return crypto.MD5(content).toString().substring(0, 8);
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error);
		return Date.now().toString();
	}
}

// Get hashes for all static assets
const assetHashes = {
	css: getFileHash(path.join(__dirname, "styles", "tailwind.css")),
	js: getFileHash(path.join(__dirname, "node_modules", "alpinejs", "dist", "cdn.min.js")),
	// Add more assets here as needed
};

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

	// Version shortcode that accepts an asset type
	eleventyConfig.addShortcode("version", (assetType = "css") => {
		return assetHashes[assetType] || assetHashes.css; // fallback to CSS hash if type not found
	});

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

	// Copy Netlify headers file to output
	eleventyConfig.addPassthroughCopy("_headers");
};
