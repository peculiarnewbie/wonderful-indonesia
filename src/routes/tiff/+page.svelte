<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import '../../app.css';
	import { onMount } from 'svelte';

	export let data;

	let blocks: { x: number; y: number; h: number }[] = [];

	onMount(() => {
		blocks = data.dataPlot;
		console.log('number: ', data.dataPlot);
	});
</script>

<div class=" w-screen h-screen bg-neutral-950">
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
