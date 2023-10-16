<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import '../../app.css';
	import { randFloat } from 'three/src/math/MathUtils.js';
	import { onMount } from 'svelte';

	let blocks: { x: number; y: number; h: number }[] = [];

	let count = 10;

	let time = 0;

	const recreate = (c: number) => {
		count = c;
		let temp = [];
		for (let i = 0; i < count; i++) {
			for (let j = 0; j < count; j++) {
				let randH = randFloat(1, 100);
				temp.push({ x: i, y: j, h: randH });
			}
		}
		blocks = temp;
	};

	const randomize = () => {
		function func() {
			return 0.5 - Math.random();
		}

		let startTime = performance.now();

		let s = blocks.sort(func);

		for (let i = 0; i < count; i++) {
			for (let j = 0; j < count; j++) {
				s[i * count + j].x = i;
				s[i * count + j].y = j;
			}
		}

		blocks = s;

		let endTime = performance.now();
		time = endTime - startTime;
	};

	onMount(() => {
		recreate(10);
	});
</script>

<div class=" w-screen h-screen bg-neutral-950">
	<div class="p-4 absolute">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			<button class="p-2 bg-white rounded-md" on:click={randomize}>randomize sort</button>
			<p>time: {time}</p>
			<div class="flex gap-1">
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						recreate(10);
					}}>10x10</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						recreate(20);
					}}>20x20</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						recreate(50);
					}}>50x50</button
				>
				<button
					class="p-2 bg-white rounded-md"
					on:click={() => {
						recreate(100);
					}}>100x100</button
				>
			</div>
		</div>
	</div>
	<Canvas>
		<!-- <Scene {height} /> -->
		<Scene {blocks} />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}
</style>
