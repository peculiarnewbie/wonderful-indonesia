import { fromUrl, fromArrayBuffer, fromBlob, type ReadRasterResult } from 'geotiff';
import fs from 'fs';

import { gzip } from 'zlib';

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

function transform(a: number, b: number, M: number[], roundToInt = false) {
	const round = (v: number) => (roundToInt ? v | 0 : v);
	return [round(M[0] + M[1] * a + M[2] * b), round(M[3] + M[4] * a + M[5] * b)];
}

// export async function load({ fetch }) {
// 	let compressed = {};

// 	let heightData: number[][] = new Array(2000);

// 	for (let i = 0; i < heightData.length; i++) {
// 		heightData[i] = new Array(2000); // Initialize the inner arrays with size 100
// 	}

// 	const readFromTif = async () => {
// 		const readFile = async (url: string) => {
// 			// let image = await Image.load();

// 			const data = fs.readFileSync(url, { encoding: 'binary' });

// 			const buffer = Buffer.from(data, 'binary');
// 			const arrayBuffer = Uint8Array.from(buffer).buffer;

// 			const tiff = await fromArrayBuffer(arrayBuffer);
// 			const image = await tiff.getImage(); // by default, the first image is read.

// 			// console.log(tiff, image);

// 			// console.log('decoding');
// 			// const decoded = tiff.decode(data);
// 			// console.log(decoded);

// 			// const response = await fetch('../api/cms/getContent', {
// 			// 	method: 'GET'
// 			// });

// 			// Construct the WGS-84 forward and inverse affine matrices:
// 			const { ModelPixelScale: s, ModelTiepoint: t } = image.fileDirectory;
// 			let [sx, sy, sz] = s;
// 			let [px, py, k, gx, gy, gz] = t;
// 			sy = -sy; // WGS-84 tiles have a "flipped" y component

// 			const pixelToGPS = [gx, sx, 0, gy, 0, sy];
// 			console.log(`pixel to GPS transform matrix:`, pixelToGPS);

// 			const gpsToPixel = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];
// 			console.log(`GPS to pixel transform matrix:`, gpsToPixel);

// 			// Convert a GPS coordinate to a pixel coordinate in our tile:
// 			const [gx1, gy1, gx2, gy2] = image.getBoundingBox();
// 			// const lat = lerp(gy1, gy2, Math.random());
// 			// const long = lerp(gx1, gx2, Math.random());
// 			const lat = lerp(gy1, gy2, 0.361);
// 			const long = lerp(gx1, gx2, 0.903);
// 			// console.log('xRange: ', gx1, ' - ', gx2);
// 			// console.log('yRange: ', gy1, ' - ', gy2);
// 			console.log(`Looking up GPS coordinate (${lat.toFixed(6)},${long.toFixed(6)})`);

// 			const [x, y] = transform(long, lat, gpsToPixel, true);
// 			console.log(`Corresponding tile pixel coordinate: [${x}][${y}]`);

// 			// And as each pixel in the tile covers a geographic area, not a single
// 			// GPS coordinate, get the area that this pixel covers:
// 			const gpsBBox = [transform(x, y, pixelToGPS), transform(x + 1, y + 1, pixelToGPS)];
// 			console.log(`Pixel covers the following GPS area:`, gpsBBox);

// 			// Finally, retrieve the elevation associated with this pixel's geographic area:
// 			const rasters = await image.readRasters();
// 			// const { width, [0]: raster } = rasters;
// 			// const elevation = raster[x + y * width] as number;
// 			// console.log(`The elevation at (${lat.toFixed(6)},${long.toFixed(6)}) is ${elevation}m`);

// 			// for (let i = 0; i < dimension.x; i++) {
// 			// 	dataPlot[i] = new Array(1000);
// 			// }
// 			// let dataPlot: { x: number; y: number; height: number }[] = [[{ x: 0, y: 0, height: 0 }]];

// 			return rasters;
// 		};

// 		const raster1 = await readFile('src/lib/components/images/1.tif');
// 		// const raster2 = await readFile('src/lib/components/images/2.tif');
// 		// const raster3 = await readFile('src/lib/components/images/3.tif');
// 		const resolution = 100;

// 		const plotHeight = (rasters: ReadRasterResult, xOffset: number, yOffset: number) => {
// 			const { width, [0]: raster } = rasters;

// 			console.log('reading height', xOffset, yOffset);

// 			for (let i = 0; i < 1000; i++) {
// 				for (let j = 0; j < 1000; j++) {
// 					//@ts-ignore
// 					heightData[i + xOffset * 10][j - 1 + yOffset * 10] = raster[i + j * width] as number;
// 				}
// 			}

// 			// console.log(compressed);

// 			console.log('height read');
// 		};

// 		plotHeight(raster1, 0, 0);
// 		// plotHeight(raster2, resolution, 0);
// 		// plotHeight(raster3, resolution, resolution);

// 		for (let i = 0; i < 2000; i++) {
// 			let hasValue = false;
// 			let anotha = {};
// 			for (let j = 0; j < 2000; j++) {
// 				let height = Math.floor(heightData[i][j]);
// 				if (!height) continue;
// 				if (height >= 0) {
// 					hasValue = true;
// 					//@ts-ignore
// 					anotha[`${j}`] = height;
// 				}
// 			}
// 			if (hasValue) {
// 				//@ts-ignore
// 				compressed[`${i}`] = anotha;
// 			}
// 		}
// 	};

// 	await readFromTif();

// 	const getJson = () => {
// 		let jsonData = JSON.stringify(compressed, null, 2);

// 		const buffer = Buffer.from(jsonData);

// 		fs.writeFileSync('data.json', buffer);

// 		// gzip(buffer, (err, buffer) => {
// 		// 	if (!err) {
// 		// 		fs.writeFileSync('testAnother.json.gz', buffer);
// 		// 	} else {
// 		// 		// handle error
// 		// 		console.log(err);
// 		// 	}
// 		// });
// 	};

// 	// getJson();

// 	return {
// 		heightData: heightData,
// 		compressed: compressed
// 	};
// }
