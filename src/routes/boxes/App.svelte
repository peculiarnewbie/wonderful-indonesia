<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	let height = 2;
</script>

<div class="p-4 absolute">
	<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
		<div class="w-4 p-2">alooo</div>
		<button
			class="w-fit p-2 bg-white rounded-md"
			on:click={() => {
				height += 0.2;
			}}
		>
			heighten</button
		>
		<button
			class="w-fit p-2 bg-white rounded-md"
			on:click={() => {
				height = 2;
			}}
		>
			reset height</button
		>
	</div>
</div>

<Canvas>
	<Scene {height} />
</Canvas>
