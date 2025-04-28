const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

// Define the sizes we want to generate
const SIZES = {
	sm: 640, // Small devices
	md: 1024, // Medium devices
	lg: 1536, // Large devices
	xl: 2048, // Extra large devices
};

async function findImagesToOptimize() {
	const imagesDir = path.join(process.cwd(), "images");
	const files = await fs.readdir(imagesDir);
	return files.filter((file) => /\.(jpg|jpeg)$/i.test(file));
}

async function optimizeImage(filename) {
	const inputPath = path.join("images", filename);
	const baseName = filename.replace(/\.(jpg|jpeg)$/i, "");

	try {
		// Get original image dimensions
		const metadata = await sharp(inputPath).metadata();
		const originalSize = (await fs.stat(inputPath)).size;

		console.log(`\n🔄 Processing ${filename}`);
		console.log(`   Original size: ${(originalSize / 1024).toFixed(1)}KB`);

		// Generate WebP versions at different sizes
		for (const [size, width] of Object.entries(SIZES)) {
			// Skip if the target width is larger than the original
			if (width > metadata.width) continue;

			const outputPath = path.join("images", `${baseName}-${size}.webp`);

			await sharp(inputPath)
				.resize(width, null, { withoutEnlargement: true })
				.webp({ quality: 80 })
				.toFile(outputPath);

			const newSize = (await fs.stat(outputPath)).size;
			const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

			console.log(
				`   ✅ Generated ${size} (${width}px): ${(newSize / 1024).toFixed(
					1
				)}KB (${savings}% smaller)`
			);
		}

		// Also generate the full-size WebP version
		const fullSizePath = path.join("images", `${baseName}.webp`);
		await sharp(inputPath).webp({ quality: 80 }).toFile(fullSizePath);

		const fullSizeNew = (await fs.stat(fullSizePath)).size;
		const fullSizeSavings = (((originalSize - fullSizeNew) / originalSize) * 100).toFixed(1);

		console.log(
			`   ✅ Generated full size: ${(fullSizeNew / 1024).toFixed(
				1
			)}KB (${fullSizeSavings}% smaller)`
		);
	} catch (error) {
		console.error(`❌ Error processing ${filename}:`, error);
	}
}

async function main() {
	console.log("🔄 Starting image optimization...\n");

	const imagesToOptimize = await findImagesToOptimize();

	if (imagesToOptimize.length === 0) {
		console.log("No JPG/JPEG images found to optimize.");
		return;
	}

	console.log(`Found ${imagesToOptimize.length} images to optimize:\n`);

	for (const image of imagesToOptimize) {
		await optimizeImage(image);
	}

	console.log("\n✨ Image optimization complete!");
}

main().catch(console.error);
