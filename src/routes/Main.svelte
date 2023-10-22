<script lang="ts">
	import { Group, OneMinusDstAlphaFactor } from 'three';
	import { T, forwardEventHandlers, useFrame } from '@threlte/core';
	import { Text, useGltf } from '@threlte/extras';
	import { interactivity, OrbitControls } from '@threlte/extras';
	import { spring, tweened, type Spring } from 'svelte/motion';

	interactivity();

	export const ref = new Group();

	const gltf = useGltf('/Sumatra Revision-transformed.glb', { useDraco: true });

	const component = forwardEventHandlers();

	export let res: number = 100;

	export let hoverIndex: number;
	export let activeIndex: number;

	export let defaultH = 10;
	export let provinces: {
		name: string;
		code: string;
		h: number;
		mat: string;
		x: number;
		y: number;
	}[];

	export let blocks: { x: number; y: number; h: number }[] = [];

	export let isHover = false;

	let scenex = spring(0);
	let sceney = spring(0);

	let blocksH = 0;

	useFrame((state, delta) => {
		// delta value might cause error for fast computers?
		if (blocksH < 1 && delta < 1) {
			blocksH += delta * 0.4;
		}
	});

	$: {
		if (res > 0) blocksH = 0;
	}

	let camera = { position: [-60, 50, 300], look: [40, 100, 0] };

	let perimeter = [
		{ x: 100, y: -1, lx: 202, ly: 1 },
		{ x: -1, y: 99.5, lx: 1, ly: 202 },
		{ x: 100, y: 200, lx: 202, ly: 1 },
		{ x: 200.5, y: 99.5, lx: 1, ly: 202 }
	];

	const hoverProvince = (index: number) => {
		const temp = [...provinces];
		temp[index].h = 500;
		provinces = temp;
		hoverIndex = index;
		isHover = true;
	};

	const leaveProvince = (index: number) => {
		const temp = [...provinces];
		temp[index].h = defaultH;
		provinces = temp;
		if (hoverIndex == index) {
			hoverIndex = -1;
			isHover = false;
		}
	};

	const selectProvince = (index: number) => {
		console.log(provinces[index].name);
		scenex.set(provinces[index].x);
		sceney.set(provinces[index].y);
		activeIndex = index;
		// console.log($scenex, $sceney);
	};
</script>

<T.PerspectiveCamera makeDefault position={camera.position}>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 10]} />
<T.DirectionalLight position={[10, 10, 10]} />
<T.DirectionalLight position={[-100, -100, 10]} intensity={0.3} />

<T.Group position.x={-100 + $scenex} position.y={-100 + $sceney} scale.z={blocksH}>
	<T
		is={ref}
		dispose={false}
		{...$$restProps}
		bind:this={$component}
		position.z={-1.5}
		position.x={0.5}
		position.y={0.5}
	>
		{#await gltf}
			<slot name="fallback" />
		{:then gltf}
			{#each provinces as province, index}
				<T.Mesh
					rotation.x={(90 * Math.PI) / 180}
					on:pointerenter={() => {
						hoverProvince(index);
					}}
					on:pointerleave={() => {
						leaveProvince(index);
					}}
					on:click={() => {
						selectProvince(index);
					}}
					geometry={gltf.nodes[`${province.code}`].geometry}
					scale={352}
					scale.y={province.h}
				>
					<T.MeshStandardMaterial color={province.mat} />
				</T.Mesh>
			{/each}
		{:catch error}
			<slot name="error" {error} />
		{/await}

		<slot {ref} />
	</T>
	{#each blocks as block, i}
		{#if block.h > 0.1}
			<T.Mesh
				position.x={block.x * (200 / res)}
				position.y={block.y * (200 / res)}
				position.z={block.h / 2}
			>
				<T.BoxGeometry args={[100 / res, 100 / res, block.h]} />
				<T.MeshStandardMaterial color="#ef476f" />
			</T.Mesh>
		{/if}
	{/each}

	<T.Group scale.x={1} position.x={10}>
		{#each perimeter as block, i}
			<T.Mesh position.x={block.x} position.y={block.y}>
				<T.BoxGeometry args={[block.lx, block.ly, 1]} />
				<T.MeshStandardMaterial color="white" />
			</T.Mesh>
		{/each}
	</T.Group>
	<Text text="Sumatra" color="white" fontSize="14" anchorX="50%" anchorY="100%" position.x={42} />
	<Text
		text="Population density of"
		color="white"
		fontSize="3"
		anchorX="50%"
		anchorY="100%"
		position.x={30}
		position.y={17}
	/>
</T.Group>
