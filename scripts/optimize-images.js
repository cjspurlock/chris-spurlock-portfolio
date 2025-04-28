const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

// Files that should remain as PNG (favicons and touch icons)
const KEEP_AS_PNG = [
	"favicon.png",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"apple-touch-icon.png",
	"android-chrome-192x192.png",
	"android-chrome-512x512.png",
];

async function findImagesToOptimize() {
	const imagesDir = path.join(process.cwd(), "images");
	const files = await fs.readdir(imagesDir);
	return files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));
}

async function optimizeImage(filename) {
	const inputPath = path.join("images", filename);
	const ext = path.extname(filename);
	const basename = path.basename(filename, ext);

	try {
		const stats = await fs.stat(inputPath);
		const originalSize = stats.size;

		if (ext.toLowerCase() === ".jpg" || ext.toLowerCase() === ".jpeg") {
			// Process JPG files with multiple sizes
			const sizes = {
				sm: 400,
				md: 800,
				lg: 1200,
				xl: 1600,
			};

			for (const [size, width] of Object.entries(sizes)) {
				const outputPath = path.join("images", `${basename}-${size}.webp`);
				await sharp(inputPath)
					.resize(width, null, { withoutEnlargement: true })
					.webp({ quality: 80 })
					.toFile(outputPath);

				const newStats = await fs.stat(outputPath);
				console.log(
					`Converted ${filename} to ${basename}-${size}.webp (${Math.round(
						(1 - newStats.size / originalSize) * 100
					)}% smaller)`
				);
			}
		} else if (ext.toLowerCase() === ".png") {
			if (KEEP_AS_PNG.includes(filename)) {
				// Optimize PNG without converting to WebP
				const outputPath = path.join("images", filename);
				await sharp(inputPath)
					.png({ quality: 80, compressionLevel: 9 })
					.toFile(`${outputPath}.temp`);

				await fs.rename(`${outputPath}.temp`, outputPath);

				const newStats = await fs.stat(outputPath);
				console.log(
					`Optimized ${filename} (${Math.round((1 - newStats.size / originalSize) * 100)}% smaller)`
				);
			} else {
				// Convert icons to WebP while maintaining transparency
				const outputPath = path.join("images", `${basename}.webp`);
				await sharp(inputPath).webp({ quality: 80, lossless: true }).toFile(outputPath);

				const newStats = await fs.stat(outputPath);
				console.log(
					`Converted ${filename} to WebP (${Math.round(
						(1 - newStats.size / originalSize) * 100
					)}% smaller)`
				);
			}
		}
	} catch (error) {
		console.error(`Error processing ${filename}:`, error);
	}
}

async function main() {
	console.log("🔄 Starting image optimization...\n");

	const imagesToOptimize = await findImagesToOptimize();

	if (imagesToOptimize.length === 0) {
		console.log("No JPG/JPEG/PNG images found to optimize.");
		return;
	}

	console.log(`Found ${imagesToOptimize.length} images to optimize:\n`);

	for (const image of imagesToOptimize) {
		await optimizeImage(image);
	}

	console.log("\n✨ Image optimization complete!");
}

main().catch(console.error);
