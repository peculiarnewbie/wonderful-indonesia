<script lang="ts">
	import { Group, OneMinusDstAlphaFactor } from 'three';
	import { T, forwardEventHandlers } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { spring, tweened, type Spring } from 'svelte/motion';

	interactivity();

	export const ref = new Group();

	const gltf = useGltf('/Sumatra Revision-transformed.glb', { useDraco: true });

	const component = forwardEventHandlers();

	export let res: number = 100;

	const defaultH = 10;
	let provinces = [
		{ name: 'Aceh', h: defaultH },
		{ name: 'Medan', h: defaultH },
		{ name: 'Sumbar', h: defaultH },
		{ name: 'Bengkulu', h: defaultH },
		{ name: 'Riau', h: defaultH },
		{ name: 'Jambi', h: defaultH },
		{ name: 'Lampung', h: defaultH },
		{ name: 'Sumsel', h: defaultH },
		{ name: 'Babel', h: defaultH },
		{ name: 'Kepri', h: defaultH }
	];

	export let blocks: { x: number; y: number; h: number }[] = [];

	let camera = { position: [10, 100, 300], look: [100, 100, 0] };

	let perimeter = [
		{ x: 99, y: -1, lx: 204, ly: 1 },
		{ x: -1, y: 99, lx: 1, ly: 204 },
		{ x: 99, y: 200, lx: 200, ly: 1 },
		{ x: 200, y: 100, lx: 1, ly: 202 }
	];

	const hoverProvince = (index: number) => {
		const temp = [...provinces];
		temp[index].h = 1000;
		provinces = temp;
		console.log(index);
	};

	const leaveProvince = (index: number) => {
		const temp = [...provinces];
		temp[index].h = defaultH;
		provinces = temp;
		console.log(index);
	};
</script>

<T.PerspectiveCamera
	makeDefault
	position={camera.position}
	on:create={({ ref }) => {
		ref.lookAt(camera.look[0], camera.look[1], camera.look[2]);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
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
				geometry={gltf.nodes[`${province.name}`].geometry}
				scale={352}
				scale.y={province.h}
			>
				<T.MeshStandardMaterial color="hotpink" />
			</T.Mesh>
		{/each}
	{:catch error}
		<slot name="error" {error} />
	{/await}

	<slot {ref} />
</T>

{#each blocks as block, i}
	{#if block.h > 0.1}
		<T.Mesh position.x={block.x * (100 / res)} position.y={block.y * (100 / res) + 100}>
			<T.BoxGeometry args={[80 / res, 80 / res, block.h]} />
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
