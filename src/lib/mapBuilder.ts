export const rebuildFromCompressed = (
	plot: string[],
	res: number,
	xOffset?: number,
	yOffset?: number
) => {
	let picRes = 1000;
	let x: number = 0;
	let y: number = 0;
	// let currentToken = 'n';
	let temp: { x: number; y: number; h: number }[] = [];

	let heightData: number[][] = new Array(picRes);

	for (let i = 0; i < heightData.length; i++) {
		heightData[i] = new Array(picRes); // Initialize the inner arrays with size 100
	}

	const next = () => {
		y++;
		if (y == 1000) {
			y = 0;
			x++;
		}
	};

	const advance = (length: number) => {
		// console.log('============== advance: ', length);
		for (let i = 0; i < length; i++) {
			heightData[x][y] = -200;
			next();
		}
	};

	const fillLand = (length: number) => {
		// console.log('============== fill Land: ', length);
		for (let i = 0; i < length; i++) {
			heightData[x][y] = 0;
			next();
		}
	};

	const fillArea = (height: number) => {
		// console.log('============== advance', length);
		heightData[x][y] = height;
		next();
	};

	plot.forEach((plot) => {
		if (plot[0] == 's') {
			const coord = Number(plot.substring(1));
			advance(coord);
		} else if (plot[0] == 'l') {
			const coord = Number(plot.substring(1));
			fillLand(coord);
		} else {
			fillArea(Number(plot));
		}
	});

	// console.log(heightData);

	const blocks = rebuild(heightData, res, xOffset, yOffset);

	return blocks;
};

export const rebuild = (
	heightData: number[][],
	resolution: number,
	xOffset?: number,
	yOffset?: number
) => {
	let currentPlot: { x: number; y: number; h: number }[] = [];
	const rev = 1000 / resolution;

	const plotToResolution = () => {
		const xOff = xOffset ? xOffset : 0;
		const yOff = yOffset ? yOffset : 0;
		for (let i = 0; i < resolution; i++) {
			for (let j = 0; j < resolution; j++) {
				let totalElevation = 0;

				for (let k = 0; k < rev; k++) {
					for (let l = 0; l < rev; l++) {
						const x = i * rev + k;
						const y = j * rev + l;
						const elevation = heightData[x][y];

						totalElevation += elevation;
						// console.log(totalElevation);
					}
				}

				// if (!hasValue) {
				// 	hasValue = true;
				// 	iActual++;
				// 	dataPlot.push(new Array(0));
				// }
				if (totalElevation < 0) continue;
				// console.log(totalElevation);
				currentPlot.push({
					x: i + xOff,
					y: resolution - 1 - j - yOff,
					h: totalElevation / 10000
				});
			}
		}

		return currentPlot;
	};
	const plot = plotToResolution();

	const blocks = [...plot];
	// console.log(blocks);
	return blocks;
};
