<script lang="ts">
	import { T, useFrame } from '@threlte/core';

	export let blocks: { x: number; y: number; h: number }[] = [];

	export let resolution = 100;

	$: rev = 100 / resolution;
</script>

<T.PerspectiveCamera
	makeDefault
	position={[20, -100, 300]}
	on:create={({ ref }) => {
		ref.lookAt(200, 0, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

<T.DirectionalLight position={[150, 1000, 100]} />

{#each blocks as block, i}
	{#if block.h > 0.1}
		<T.Mesh position.x={block.x * rev} position.y={block.y * rev} position.z={block.h / (4 * rev)}>
			<T.BoxGeometry args={[rev, rev, block.h / (rev * 2)]} />
			<T.MeshStandardMaterial color="hotpink" />
		</T.Mesh>
		<!-- {:else if block.h == 0}
		<T.Mesh position.x={block.x * rev} position.y={block.y * rev}>
			<T.BoxGeometry args={[rev, rev, 0.1]} />
			<T.MeshStandardMaterial color="hotpink" />
		</T.Mesh> -->
	{/if}
{/each}
