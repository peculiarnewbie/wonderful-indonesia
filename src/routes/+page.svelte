<script lang="ts">
	import App from '$lib/components/App.svelte';
	import Main from './Main.svelte';
	import { Canvas } from '@threlte/core';
	import { rebuildPlot, combinePlots } from '$lib/mapBuilder';
	import '../app.css';
	import plot1 from '../lib/components/plots/plot1.json';
	import plot2 from '../lib/components/plots/plot2.json';
	import plot3 from '../lib/components/plots/plot3.json';
	import plot4 from '../lib/components/plots/plot4.json';

	import { onMount, tick } from 'svelte';

	let heightData: number[][];

	let blocks: { x: number; y: number; h: number }[] = [];

	let res: number = 100;

	let isHover = false;

	const picRes = 2000;

	const initialBuild = async () => {
		const plots = [
			{ plot: plot1, xOffset: 0, yOffset: 0 },
			{ plot: plot2, xOffset: 1, yOffset: 0 },
			{ plot: plot3, xOffset: 0, yOffset: 1 },
			{ plot: plot4, xOffset: 1, yOffset: 1 }
		];
		heightData = combinePlots(plots, 1000);
		console.log(heightData);
		blocks = await rebuildPlot(heightData, picRes, 100);
	};

	const rebuild = async (resolution: number) => {
		isBlur = true;
		await tick();
		setTimeout(() => {
			clearBlocks(resolution);
		}, 100);
	};

	const clearBlocks = async (resolution: number) => {
		blocks = [];
		await tick();
		setTimeout(() => {
			rebuildBlocks(resolution);
		}, 100);
	};

	const rebuildBlocks = async (resolution: number) => {
		res = resolution;
		blocks = await rebuildPlot(heightData, picRes, res);
		isBlur = false;
	};

	let defaultH = 100;
	let hoverIndex = -1;

	let activeProvince = ' ';

	let isBlur = false;

	let provinces = [
		{ name: 'Aceh', code: 'Aceh', h: defaultH, mat: 'hotpink', x: 20, y: -20 },
		{ name: 'Sumatera Utara', code: 'Medan', h: defaultH, mat: 'green', x: 0, y: 0 },
		{ name: 'Sumatera Barat', code: 'Sumbar', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Bengkulu', code: 'Bengkulu', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Riau', code: 'Riau', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Jambi', code: 'Jambi', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Lampung', code: 'Lampung', h: defaultH, mat: 'blue', x: 0, y: 0 },
		{ name: 'Sumatera Selatan', code: 'Sumsel', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Bangka Belitung', code: 'Babel', h: defaultH, mat: 'hotpink', x: 0, y: 0 },
		{ name: 'Kepulauan Riau', code: 'Kepri', h: defaultH, mat: 'hotpink', x: 0, y: 0 }
	];

	$: {
		if (hoverIndex == -1) activeProvince = ' ';
		else activeProvince = provinces[hoverIndex].name;
	}

	onMount(() => {
		initialBuild();
	});
</script>

<div class=" w-screen h-screen BG">
	<div class="p-4 absolute z-10">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			resolution:
			<div class="flex gap-2">
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(50);
					}}
				>
					50
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(100);
					}}
				>
					100
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(200);
					}}
				>
					200
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(500);
					}}
				>
					500
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(1000);
					}}
				>
					1000
				</button>
			</div>
			<div>province: {activeProvince}</div>
			<div class=" p-4 rounded-full hover:rounded-none bg-white" />
		</div>
	</div>
	{#if isBlur}
		<div class="w-screen h-screen backdrop-blur-sm absolute" />
		<div class="w-screen h-screen flex justify-center items-center absolute">
			<div class="bg-neutral-400 rounded-md h-fit w-fit p-4 px-8">Loading...</div>
		</div>
	{/if}
	<div class={`w-screen h-screen ${isHover ? 'cursor-pointer' : ''}`}>
		<Canvas>
			<Main {blocks} {res} bind:provinces {defaultH} bind:hoverIndex bind:isBlur bind:isHover />
		</Canvas>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}
	.BG {
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>
