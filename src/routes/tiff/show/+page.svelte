<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import '../../../app.css';
	import { onMount } from 'svelte';

	export let data;

	let res = 100;

	let heightData: number[][];

	let blocks: { x: number; y: number; h: number }[] = [];

	const rebuild = (resolution: number) => {
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
		const plot2 = plotToResolution(resolution, 0);
		const plot3 = plotToResolution(resolution, resolution);

		blocks = [...plot1, ...plot2, ...plot3];
		res = resolution;
	};

	onMount(() => {
		heightData = data.heightData;
		rebuild(50);
		// blocks = data.dataPlot;
		// console.log('number: ', data.heightData);
	});
</script>

<div class=" w-screen h-screen bg-neutral-950">
	<div class="p-4 absolute">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			<p>resolution:</p>
			<div class="flex gap-1">
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						rebuild(10);
					}}>super low</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						rebuild(25);
					}}>low</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						rebuild(50);
					}}>medium</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						rebuild(100);
					}}>high</button
				>
			</div>
		</div>
	</div>
	<Canvas>
		<!-- <Scene {height} /> -->
		<Scene {blocks} resolution={res} />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}
</style>
