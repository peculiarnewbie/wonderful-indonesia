<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { spring, tweened, type Spring } from 'svelte/motion';
	import { randFloat } from 'three/src/math/MathUtils.js';

	export let blocks: { x: number; y: number; h: number }[] = [];
</script>

<T.PerspectiveCamera
	makeDefault
	position={[-10, 10, 200]}
	on:create={({ ref }) => {
		ref.lookAt(50, 50, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

{#each blocks as block, i}
	<T.Mesh position.x={block.x} position.y={block.y}>
		<T.BoxGeometry args={[1, 1, block.h]} />
		<T.MeshStandardMaterial color="hotpink" />
	</T.Mesh>
{/each}
