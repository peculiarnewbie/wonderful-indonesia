export const rebuildFromCompressed = (plot: string[], picRes: number) => {
	let x: number = 0;
	let y: number = 0;

	let heightData: number[][] = new Array(picRes);

	for (let i = 0; i < heightData.length; i++) {
		heightData[i] = new Array(picRes); // Initialize the inner arrays with size 100
	}

	const next = () => {
		y++;
		if (y == picRes) {
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

	// const blocks = rebuild(heightData, res, xOffset, yOffset);

	// return blocks;

	return heightData;
};

export const rebuildPlot = async (heightData: number[][], plotRes: number, resolution: number) => {
	let currentPlot: { x: number; y: number; h: number }[] = [];
	const rev = plotRes / resolution;

	const plotToResolution = () => {
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
					x: i,
					y: resolution - 1 - j,
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

// need optimizing, rn we're copying the height data for each plot
// also only support squares rn
export const combinePlots = (
	plots: { plot: string[]; xOffset: number; yOffset: number }[],
	picRes: number
) => {
	let heightData: number[][] = new Array((picRes * plots.length) / 2);

	for (let i = 0; i < (picRes * plots.length) / 2; i++) {
		heightData[i] = new Array(picRes);
	}

	plots.forEach((plotObject) => {
		const height = rebuildFromCompressed(plotObject.plot, picRes);
		for (let i = 0; i < picRes; i++) {
			for (let j = 0; j < picRes; j++) {
				heightData[i + plotObject.xOffset * picRes][j + plotObject.yOffset * picRes] = height[i][j];
			}
		}
	});

	return heightData;
};
