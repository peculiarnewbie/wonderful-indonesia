<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { onMount } from 'svelte';

	export let blocks: { x: number; y: number; h: number }[] = [];

	export let res: number;

	let camera = { position: [-res / 10, res / 2, res * 1.5], look: [res / 2, res / 2, 0] };

	export let perimeter: { x: number; y: number; h: number }[] = [];
	// for (let i = 0; i < 4; i++) {
	// 	for (let j = 0; j < res; i++) {
	// 		if (i == 0) perimeter.push({ x: j, y: -1, h: 1 });
	// 		else if (i == 1) perimeter.push({ x: j, y: res + 1, h: 1 });
	// 		else if (i == 2) perimeter.push({ x: -1, y: j, h: 1 });
	// 		else perimeter.push({ x: res + 1, y: j, h: 1 });
	// 	}
	// }
</script>

+<T.PerspectiveCamera
	makeDefault
	position={camera.position}
	on:create={({ ref }) => {
		ref.lookAt(camera.look[0], camera.look[1], camera.look[2]);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

<T.DirectionalLight position={[100, 1000, 100]} />

{#each blocks as block, i}
	{#if block.h > 0.1}
		<T.Mesh position.x={block.x / (res / 100)} position.y={block.y / (res / 100)}>
			<T.BoxGeometry args={[100 / res, 100 / res, block.h]} />
			<T.MeshStandardMaterial color="hotpink" />
		</T.Mesh>
	{/if}
{/each}

{#each perimeter as block, i}
	{#if block.h > 0.1}
		<T.Mesh position.x={block.x / (res / 100)} position.y={block.y / (res / 100)}>
			<T.BoxGeometry args={[100 / res, 100 / res, block.h]} />
			<T.MeshStandardMaterial color="white" />
		</T.Mesh>
	{/if}
{/each}
