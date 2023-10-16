import { fromUrl, fromArrayBuffer, fromBlob, type ReadRasterResult } from 'geotiff';
import fs from 'fs';

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

function transform(a, b, M, roundToInt = false) {
	const round = (v) => (roundToInt ? v | 0 : v);
	return [round(M[0] + M[1] * a + M[2] * b), round(M[3] + M[4] * a + M[5] * b)];
}

export async function load({ fetch }) {
	const readFile = async (url: string) => {
		// let image = await Image.load();

		const data = fs.readFileSync(url, { encoding: 'binary' });

		const buffer = Buffer.from(data, 'binary');
		const arrayBuffer = Uint8Array.from(buffer).buffer;

		const tiff = await fromArrayBuffer(arrayBuffer);
		const image = await tiff.getImage(); // by default, the first image is read.

		// console.log(tiff, image);

		// console.log('decoding');
		// const decoded = tiff.decode(data);
		// console.log(decoded);

		// const response = await fetch('../api/cms/getContent', {
		// 	method: 'GET'
		// });

		// Construct the WGS-84 forward and inverse affine matrices:
		const { ModelPixelScale: s, ModelTiepoint: t } = image.fileDirectory;
		let [sx, sy, sz] = s;
		let [px, py, k, gx, gy, gz] = t;
		sy = -sy; // WGS-84 tiles have a "flipped" y component

		const pixelToGPS = [gx, sx, 0, gy, 0, sy];
		console.log(`pixel to GPS transform matrix:`, pixelToGPS);

		const gpsToPixel = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];
		console.log(`GPS to pixel transform matrix:`, gpsToPixel);

		// Convert a GPS coordinate to a pixel coordinate in our tile:
		const [gx1, gy1, gx2, gy2] = image.getBoundingBox();
		// const lat = lerp(gy1, gy2, Math.random());
		// const long = lerp(gx1, gx2, Math.random());
		const lat = lerp(gy1, gy2, 0.361);
		const long = lerp(gx1, gx2, 0.903);
		// console.log('xRange: ', gx1, ' - ', gx2);
		// console.log('yRange: ', gy1, ' - ', gy2);
		console.log(`Looking up GPS coordinate (${lat.toFixed(6)},${long.toFixed(6)})`);

		const [x, y] = transform(long, lat, gpsToPixel, true);
		console.log(`Corresponding tile pixel coordinate: [${x}][${y}]`);

		// And as each pixel in the tile covers a geographic area, not a single
		// GPS coordinate, get the area that this pixel covers:
		const gpsBBox = [transform(x, y, pixelToGPS), transform(x + 1, y + 1, pixelToGPS)];
		console.log(`Pixel covers the following GPS area:`, gpsBBox);

		// Finally, retrieve the elevation associated with this pixel's geographic area:
		const rasters = await image.readRasters();
		// const { width, [0]: raster } = rasters;
		// const elevation = raster[x + y * width] as number;
		// console.log(`The elevation at (${lat.toFixed(6)},${long.toFixed(6)}) is ${elevation}m`);

		// for (let i = 0; i < dimension.x; i++) {
		// 	dataPlot[i] = new Array(1000);
		// }
		// let dataPlot: { x: number; y: number; height: number }[] = [[{ x: 0, y: 0, height: 0 }]];

		return rasters;
	};

	let dataPlot: { x: number; y: number; h: number }[] = [];

	const raster1 = await readFile('src/lib/components/images/1.tif');
	const raster2 = await readFile('src/lib/components/images/2.tif');
	const raster3 = await readFile('src/lib/components/images/3.tif');

	const createPlot = (rasters: ReadRasterResult, xOffset: number, yOffset: number) => {
		let currentPlot: { x: number; y: number; h: number }[] = [];
		const dimension = { x: 100, y: 100 };

		const { width, [0]: raster } = rasters;
		let iActual = -1;
		for (let i = 0; i < dimension.x; i++) {
			let hasValue = false;
			for (let j = 0; j < dimension.y; j++) {
				let totalElevation = 0;

				for (let k = 0; k < 10; k++) {
					for (let l = 0; l < 10; l++) {
						const x = i * 10 + k;
						const y = j * 10 + l;
						const elevation = raster[x + y * width] as number;

						if (elevation <= 0) continue;
						totalElevation += elevation;
						// console.log(totatlElevation);
					}
				}

				// if (!hasValue) {
				// 	hasValue = true;
				// 	iActual++;
				// 	dataPlot.push(new Array(0));
				// }
				currentPlot.push({ x: i + xOffset, y: 99 - j + yOffset, h: totalElevation / 10000 });
			}
		}
		return currentPlot;
	};

	dataPlot = [
		...createPlot(raster1, 0, 0),
		...createPlot(raster2, 100, 0),
		...createPlot(raster3, 100, -100)
	];

	// console.log(dataPlot);

	return {
		dataPlot: dataPlot
	};
}
