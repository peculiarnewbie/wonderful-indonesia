<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { onMount } from 'svelte';

	export let blocks: { x: number; y: number; h: number }[] = [];

	export let res: number;

	let camera = { position: [-res / 10, res / 2, res * 1.5], look: [res / 2, res / 2, 0] };

	let perimeter = [
		{ x: 49.5, y: -1, lx: 102, ly: 1 },
		{ x: -1, y: 49.5, lx: 1, ly: 102 },
		{ x: 49.5, y: 100, lx: 100, ly: 1 },
		{ x: 100, y: 50, lx: 1, ly: 101 }
	];
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
	<T.Mesh position.x={block.x} position.y={block.y}>
		<T.BoxGeometry args={[block.lx, block.ly, 1]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>
{/each}
