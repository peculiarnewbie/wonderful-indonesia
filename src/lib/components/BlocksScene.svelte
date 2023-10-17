<script lang="ts">
	import { T, useFrame } from '@threlte/core';

	export let blocks: { x: number; y: number; h: number }[] = [];

	export let camera = { position: [20, 10, 100], look: [50, 25, 0] };
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
		<T.Mesh position.x={block.x} position.y={block.y}>
			<T.BoxGeometry args={[1, 1, block.h]} />
			<T.MeshStandardMaterial color="hotpink" />
		</T.Mesh>
	{/if}
{/each}
