<script lang="ts">
	import App from '$lib/components/App.svelte';
	import Main from './Main.svelte';
	import { Canvas } from '@threlte/core';
	import { rebuildFromCompressed } from '$lib/mapBuilder';
	import '../app.css';
	import plot1 from '../lib/components/plots/1.json';
	import plot2 from '../lib/components/plots/2.json';
	import plot3 from '../lib/components/plots/3.json';
	import plot4 from '../lib/components/plots/4.json';

	import { onMount } from 'svelte';

	let plot: string[] = plot1;

	let blocks: { x: number; y: number; h: number }[] = [];

	let res: number = 100;

	onMount(() => {
		const newBlocks1 = rebuildFromCompressed(plot1, res);
		const newBlocks2 = rebuildFromCompressed(plot2, res, res, 0);
		const newBlocks3 = rebuildFromCompressed(plot3, res, 0, res);
		const newBlocks4 = rebuildFromCompressed(plot4, res, res, res);
		const newBlocks = [...newBlocks1, ...newBlocks2, ...newBlocks3, ...newBlocks4];

		blocks = newBlocks;
	});
</script>

<div class=" w-screen h-screen BG">
	<div class="p-4 absolute">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			<div class="flex gap-2">
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 50;
						rebuildFromCompressed(plot, 50);
					}}
				>
					50
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 100;
						rebuildFromCompressed(plot, 100);
					}}
				>
					100
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 200;
						rebuildFromCompressed(plot, 200);
					}}
				>
					200
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 500;
						rebuildFromCompressed(plot, 500);
					}}
				>
					500
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 1000;
						rebuildFromCompressed(plot, 1000);
					}}
				>
					1000
				</button>
			</div>
		</div>
	</div>
	<Canvas>
		<Main {blocks} {res} />
	</Canvas>
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
