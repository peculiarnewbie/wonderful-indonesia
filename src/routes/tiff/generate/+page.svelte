<script lang="ts">
	import { Canvas } from '@threlte/core';
	import BlocksScene from '$lib/components/BlocksScene.svelte';
	import '../../../app.css';
	import { onMount } from 'svelte';
	import triggerDownload from '$lib/components/download';

	export let data;

	let file: FileList;

	let res = 100;

	let blocks: { x: number; y: number; h: number }[] = [];

	let plot: string[];

	const postContent = async () => {
		let data = new FormData();
		data.append('file', file[0]);
		console.log('posting');
		const response = await fetch('../api/upload', {
			method: 'POST',
			body: data
		});
		const res = await response.json();
		// console.log(res);

		// rebuild(res.jsonData, 50);
		plot = res.jsonData;
		rebuildFromCompressed();

		triggerDownload(res.jsonData);
	};

	const rebuildFromCompressed = () => {
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

		rebuild(heightData, res);
	};

	const rebuild = (heightData: number[][], resolution: number) => {
		res = resolution;
		let currentPlot: { x: number; y: number; h: number }[] = [];
		const rev = 1000 / resolution;

		const plotToResolution = (xOffset: number, yOffset: number) => {
			for (let i = 0; i < resolution; i++) {
				for (let j = 0; j < resolution; j++) {
					let totalElevation = 0;

					for (let k = 0; k < rev; k++) {
						for (let l = 0; l < rev; l++) {
							const x = i * rev + k;
							const y = j * rev + l;
							const elevation = heightData[x + xOffset * rev][y + yOffset * rev];

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
						x: i + xOffset,
						y: resolution - 1 - j - yOffset,
						h: totalElevation / 10000
					});
				}
			}

			return currentPlot;
		};
		const plot1 = plotToResolution(0, 0);

		blocks = [...plot1];
		// console.log(blocks);
	};
</script>

<div class=" w-screen h-screen bg-neutral-950">
	<div class="p-4 absolute">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			<div class="flex gap-1">
				<form on:submit={postContent}>
					<label for="file">Choose a file:</label>
					<input type="file" id="file" bind:files={file} />
					<button type="submit">Upload</button>
				</form>
			</div>
			<div class="flex gap-2">
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 50;
						rebuildFromCompressed();
					}}
				>
					50
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 100;
						rebuildFromCompressed();
					}}
				>
					100
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 200;
						rebuildFromCompressed();
					}}
				>
					200
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 500;
						rebuildFromCompressed();
					}}
				>
					500
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 1000;
						rebuildFromCompressed();
					}}
				>
					1000
				</button>
			</div>
		</div>
	</div>
	<Canvas>
		<BlocksScene {blocks} {res} />
	</Canvas>
</div>
