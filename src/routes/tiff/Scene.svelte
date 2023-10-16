<script lang="ts">
	import { T, useFrame } from '@threlte/core';

	export let blocks: { x: number; y: number; h: number }[] = [];
</script>

+<T.PerspectiveCamera
	makeDefault
	position={[20, 10, 300]}
	on:create={({ ref }) => {
		ref.lookAt(150, 0, 0);
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
