const sharp = require("sharp");
const fs = require("node:fs").promises;
const path = require("node:path");
const glob = require("glob");

// Function to get all image files
async function getImageFiles() {
	// Get all PNG files in the images directory
	const pngFiles = glob.sync("images/*.png").map((file) => ({
		input: path.basename(file),
		output: path.basename(file).replace(".png", ".webp"),
		sizes: [64, 128, 256], // Default sizes for logos
		quality: 85, // Higher quality for logos
	}));

	// Get all JPG files in the images directory
	const jpgFiles = glob.sync("images/*.jpg").map((file) => ({
		input: path.basename(file),
		output: path.basename(file).replace(".jpg", ".webp"),
		sizes: [300, 600, 900, 1200], // More granular sizes for project images
		quality: 75, // Slightly lower quality for photos
	}));

	// Get all base WEBP files in the images directory (exclude already-resized ones)
	const webpFiles = glob
		.sync("images/*.webp")
		.filter((file) => !file.match(/-(64|128|256|300|600|900|1200)\.webp$/))
		.map((file) => {
			const name = path.basename(file);
			// Use logo sizes for icon--* files, project sizes for others
			const isLogo = name.startsWith("icon--");
			return {
				input: name,
				output: name, // Output is the same as input for webp
				sizes: isLogo ? [64, 128, 256] : [300, 600, 900, 1200],
				quality: isLogo ? 85 : 75,
			};
		});

	return [...pngFiles, ...jpgFiles, ...webpFiles];
}

async function optimizeImage(imageConfig) {
	const inputPath = path.join("images", imageConfig.input);
	const outputBasePath = path.join("images", path.parse(imageConfig.output).name);

	try {
		// Get image metadata
		const metadata = await sharp(inputPath).metadata();

		// Generate different sizes
		for (const size of imageConfig.sizes) {
			// Don't upscale images
			if (size > metadata.width) {
				console.log(
					`Skipping ${size}px for ${imageConfig.input} (original width: ${metadata.width}px)`
				);
				continue;
			}

			const outputPath = `${outputBasePath}-${size}.webp`;
			await sharp(inputPath)
				.resize(size, null, {
					withoutEnlargement: true,
					fit: "inside",
				})
				.webp({
					quality: imageConfig.quality,
					effort: 6, // Higher compression effort
					nearLossless: true, // Better quality for sharp edges
				})
				.toFile(outputPath);

			const stats = await fs.stat(outputPath);
			console.log(`Created ${outputPath} (${(stats.size / 1024).toFixed(2)}KB)`);
		}

		// Create the default size (largest that doesn't exceed original dimensions)
		const defaultSize = Math.min(metadata.width, imageConfig.sizes[imageConfig.sizes.length - 1]);

		const defaultOutputPath = path.join("images", imageConfig.output);
		await sharp(inputPath)
			.resize(defaultSize, null, {
				withoutEnlargement: true,
				fit: "inside",
			})
			.webp({
				quality: imageConfig.quality,
				effort: 6,
				nearLossless: true,
			})
			.toFile(defaultOutputPath);

		const stats = await fs.stat(defaultOutputPath);
		console.log(`Created ${defaultOutputPath} (${(stats.size / 1024).toFixed(2)}KB)`);
	} catch (error) {
		console.error(`Error processing ${imageConfig.input}:`, error);
	}
}

async function main() {
	console.log("Starting image optimization...");

	// Get all image files
	const imagesToOptimize = await getImageFiles();

	// Process all images
	for (const image of imagesToOptimize) {
		await optimizeImage(image);
	}

	console.log("Image optimization complete!");
}

main().catch(console.error);
