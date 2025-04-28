const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function findImagesToOptimize() {
	const imagesDir = path.join(process.cwd(), "images");
	const files = await fs.readdir(imagesDir);
	return files.filter((file) => /\.(jpg|jpeg)$/i.test(file));
}

async function optimizeImage(filename) {
	const inputPath = path.join("images", filename);
	const outputPath = path.join("images", filename.replace(/\.(jpg|jpeg)$/i, ".webp"));

	try {
		// Convert to WebP with quality optimization
		await sharp(inputPath)
			.webp({ quality: 80 }) // Adjust quality as needed
			.toFile(outputPath);

		console.log(`✅ Converted ${filename} to WebP`);

		// Get file sizes for comparison
		const originalSize = (await fs.stat(inputPath)).size;
		const newSize = (await fs.stat(outputPath)).size;
		const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

		console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
		console.log(`   New: ${(newSize / 1024).toFixed(1)}KB`);
		console.log(`   Savings: ${savings}%`);
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
