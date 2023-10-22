<script lang="ts">
	import { Canvas } from '@threlte/core';
	import BlocksScene from '$lib/components/BlocksScene.svelte';
	import '../../../../app.css';
	import { onMount } from 'svelte';
	import triggerDownload from '$lib/download';
	import { rebuildFromCompressed } from '$lib/mapBuilder';

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
		rebuildFromCompressed(plot, res);

		triggerDownload(res.jsonData);
	};

	// onMount(() => {
	// 	blocks = rebuildFromCompressed()

	// })
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
						rebuildFromCompressed(plot, res);
					}}
				>
					50
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 100;
						rebuildFromCompressed(plot, res);
					}}
				>
					100
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 200;
						rebuildFromCompressed(plot, res);
					}}
				>
					200
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 500;
						rebuildFromCompressed(plot, res);
					}}
				>
					500
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						res = 1000;
						rebuildFromCompressed(plot, res);
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
