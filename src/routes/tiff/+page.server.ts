import type { ReadRasterResult } from 'geotiff';
import fs from 'fs';
import { generateRasterFromBuffer } from '$lib/tiffConvert.js';

export async function load({ fetch }) {
	const readFile = async (url: string) => {
		// let image = await Image.load();

		const data = fs.readFileSync(url, { encoding: 'binary' });

		const buffer = Buffer.from(data, 'binary');
		const rasters = await generateRasterFromBuffer(buffer);

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
						//@ts-ignore
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
