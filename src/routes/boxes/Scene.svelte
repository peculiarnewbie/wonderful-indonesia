<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { spring, tweened, type Spring } from 'svelte/motion';

	interactivity();
	const scale = spring(0.5);
	const positionY = tweened(1);

	let block = { x: 0, y: 0, s: 1 };
	let blocks: { x: number; y: number; s: number; r: number; isR: boolean }[] = [];
	let scales: Spring<number>[] = [];

	let count = 10;

	for (let i = 0; i < count; i++) {
		for (let j = 0; j < count; j++) {
			scales.push(spring(0.5));
			blocks.push({ x: i * 2, y: j * 2, s: 0.5, r: 0, isR: false });
			scales[i * count + j].subscribe((value) => {
				blocks[i * count + j].s = value;
			});
		}
	}

	let rotation = 0;
	useFrame((state, delta) => {
		rotation += delta;
		let temp = blocks;
		temp.forEach((block) => {
			if (!block.isR) return;
			block.r += delta;
		});
		blocks = temp;
	});

	export let height = 2;
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 20]}
	on:create={({ ref }) => {
		ref.lookAt(10, 10, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

{#each blocks as block, i}
	<T.Mesh
		rotation.y={block.r}
		position.x={block.x}
		position.y={block.y}
		scale={block.s}
		on:pointerenter={() => {
			scales[i].set(1.5);
			positionY.set(2);
			block.isR = true;
			console.log(i);
		}}
		on:pointerleave={() => {
			scales[i].set(0.5);
			positionY.set(1);
			block.isR = false;
		}}
	>
		<T.BoxGeometry args={[1, height, 1]} />
		<T.MeshStandardMaterial color="hotpink" />
	</T.Mesh>
{/each}
