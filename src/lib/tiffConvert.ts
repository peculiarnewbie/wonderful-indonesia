import GeoTIFF, {
	fromUrl,
	fromArrayBuffer,
	fromBlob,
	type ReadRasterResult,
	GeoTIFFImage
} from 'geotiff';

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

function transform(a: number, b: number, M: number[], roundToInt = false) {
	const round = (v: number) => (roundToInt ? v | 0 : v);
	return [round(M[0] + M[1] * a + M[2] * b), round(M[3] + M[4] * a + M[5] * b)];
}

async function generateImageFromBuffer(buffer: Buffer) {
	console.log('===================== generating image');
	const arrayBuffer = Uint8Array.from(buffer).buffer;

	const tiff = await fromArrayBuffer(arrayBuffer);
	const image = await tiff.getImage();

	return image;
}

export async function convertTIFF(buffer: Buffer) {
	const image = await generateImageFromBuffer(buffer);
	// console.log('==================== image generated: ', image);

	const resolution = image.getResolution()[0];

	let heightData: number[][] = new Array(resolution);

	for (let i = 0; i < heightData.length; i++) {
		heightData[i] = new Array(resolution); // Initialize the inner arrays with size 100
	}

	console.log('==================== \n resolution: ', resolution);

	const rasters = await generateRaster(image);

	const compressRaster = () => {
		const { width, [0]: raster } = rasters;
		let compressed: string[] = [];

		let token = 'n';
		let count = 0;

		for (let i = 0; i < resolution; i++) {
			for (let j = 0; j < resolution; j++) {
				//@ts-ignore
				let height = raster[i + j * width] as number;
				height = Math.floor(height);
				if (height < 0) {
					if (token != 's') {
						if (token == 'l') {
							let string = token + count.toString();
							compressed.push(string);
						}
						token = 's';
						count = 1;
					} else {
						count++;
					}
				} else if (height == 0) {
					if (token != 'l') {
						if (token == 's') {
							let string = token + count.toString();
							compressed.push(string);
						}
						token = 'l';
						count = 1;
					} else {
						count++;
					}
				} else {
					if (token != 'n') {
						let string = token + count.toString();
						compressed.push(string);
						token = 'n';
						count = 0;
					}
					compressed.push(height.toString());
				}
			}
		}
		return compressed;
	};

	const plotHeight = (xOffset: number, yOffset: number) => {
		const { width, [0]: raster } = rasters;

		console.log('reading height', xOffset, yOffset);

		for (let i = 0; i < 1000; i++) {
			for (let j = 0; j < 1000; j++) {
				//@ts-ignore
				heightData[i + xOffset * 10][j - 1 + yOffset * 10] = raster[i + j * width] as number;
			}
		}

		// console.log(compressed);

		console.log('height read');
	};

	// plotHeight(0, 0);
	// return heightData;

	const compressed = compressRaster();
	return compressed;
}

export async function generateRasterFromBuffer(buffer: Buffer) {
	const image = await generateImageFromBuffer(buffer);

	const rasters = await generateRaster(image);

	return rasters;
}

export async function generateRaster(image: GeoTIFFImage) {
	// const { ModelPixelScale: s, ModelTiepoint: t } = image.fileDirectory;
	// let [sx, sy, sz] = s;
	// let [px, py, k, gx, gy, gz] = t;
	// sy = -sy; // WGS-84 tiles have a "flipped" y component

	// const pixelToGPS = [gx, sx, 0, gy, 0, sy];

	// const gpsToPixel = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];

	// const [gx1, gy1, gx2, gy2] = image.getBoundingBox();
	// const lat = lerp(gy1, gy2, s);
	// const long = lerp(gx1, gx2, t);

	// const [x, y] = transform(long, lat, gpsToPixel, true);

	// const gpsBBox = [transform(x, y, pixelToGPS), transform(x + 1, y + 1, pixelToGPS)];

	const rasters = await image.readRasters();

	return rasters;
}
