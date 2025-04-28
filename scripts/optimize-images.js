const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const glob = require("glob");

// Function to get all image files
async function getImageFiles() {
	// Get all PNG files in the images directory
	const pngFiles = glob.sync("images/*.png").map((file) => ({
		input: path.basename(file),
		output: path.basename(file).replace(".png", ".webp"),
		sizes: [64, 128, 256], // Default sizes for logos
	}));

	// Get all JPG files in the images directory
	const jpgFiles = glob.sync("images/*.jpg").map((file) => ({
		input: path.basename(file),
		output: path.basename(file).replace(".jpg", ".webp"),
		sizes: [400, 800, 1200], // Default sizes for project images
	}));

	// Get all base WEBP files in the images directory (exclude already-resized ones)
	const webpFiles = glob
		.sync("images/*.webp")
		.filter((file) => !file.match(/-(64|128|256|400|800|1200)\.webp$/))
		.map((file) => {
			const name = path.basename(file);
			// Use logo sizes for icon--* files, project sizes for others
			const isLogo = name.startsWith("icon--");
			return {
				input: name,
				output: name, // Output is the same as input for webp
				sizes: isLogo ? [64, 128, 256] : [400, 800, 1200],
			};
		});

	return [...pngFiles, ...jpgFiles, ...webpFiles];
}

async function optimizeImage(imageConfig) {
	const inputPath = path.join("images", imageConfig.input);
	const outputBasePath = path.join("images", path.parse(imageConfig.output).name);

	try {
		// Generate different sizes
		for (const size of imageConfig.sizes) {
			const outputPath = `${outputBasePath}-${size}.webp`;
			await sharp(inputPath).resize(size).webp({ quality: 80 }).toFile(outputPath);

			const stats = await fs.stat(outputPath);
			console.log(`Created ${outputPath} (${(stats.size / 1024).toFixed(2)}KB)`);
		}

		// Create the default size (largest)
		const defaultOutputPath = path.join("images", imageConfig.output);
		await sharp(inputPath)
			.resize(imageConfig.sizes[imageConfig.sizes.length - 1])
			.webp({ quality: 80 })
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
