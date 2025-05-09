const htmlmin = require("html-minifier");
const crypto = require("crypto-js");
const fs = require("node:fs");
const path = require("node:path");
const Critters = require("critters");

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

	// Pass directories through to the _site folder
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("assets");
	eleventyConfig.addPassthroughCopy("fonts");

	// Pass Alpine.js through to the _site folder
	eleventyConfig.addPassthroughCopy({
		"./node_modules/alpinejs/dist/cdn.min.js": "./js/alpine.js",
	});

	// Version shortcode that accepts an asset type
	eleventyConfig.addShortcode("version", (assetType = "css") => {
		return assetHashes[assetType] || assetHashes.css; // fallback to CSS hash if type not found
	});

	// Process critical CSS with critters
	eleventyConfig.addTransform("critical-css", async (content, outputPath) => {
		if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith(".html")) {
			const critters = new Critters({
				// Keep the original CSS file
				pruneSource: false,
				// Include all media queries
				inlineThreshold: 0,
				// Don't remove any CSS
				reduceInlineStyles: false,
				// Additional options for better compatibility
				mergeStylesheets: true,
				preload: "swap",
				// Debug mode in development
				debug: process.env.NODE_ENV !== "production",
			});

			try {
				const processed = await critters.process(content);
				return processed;
			} catch (error) {
				console.error("Error processing critical CSS:", error);
				return content;
			}
		}
		return content;
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

	// Copy static files to the output directory
	eleventyConfig.addPassthroughCopy("robots.txt");
	eleventyConfig.addPassthroughCopy("sitemap.xml");
	eleventyConfig.addPassthroughCopy("_headers");
	eleventyConfig.addPassthroughCopy("images/site.webmanifest");
	eleventyConfig.addPassthroughCopy("images/favicon.ico");
	eleventyConfig.addPassthroughCopy("images/favicon-16x16.png");
	eleventyConfig.addPassthroughCopy("images/favicon-32x32.png");
	eleventyConfig.addPassthroughCopy("images/apple-touch-icon.png");
	eleventyConfig.addPassthroughCopy("images/android-chrome-192x192.png");
	eleventyConfig.addPassthroughCopy("images/android-chrome-512x512.png");
};
