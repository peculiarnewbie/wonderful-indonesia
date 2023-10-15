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
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			scales.push(spring(0.5));
			blocks.push({ x: i * 2, y: j * 2, s: 0.5, r: 0, isR: false });
			scales[i * 5 + j].subscribe((value) => {
				blocks[i * 5 + j].s = value;
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
	position={[10, 10, 10]}
	on:create={({ ref }) => {
		ref.lookAt(5, 5, 0);
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

<!-- <T.PerspectiveCamera
  makeDefault
  position={[-10, 10, 10]}
  fov={15}
>
  <OrbitControls
    autoRotate
    enableZoom={false}
    enableDamping
    autoRotateSpeed={0.5}
    target.y={1.5}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.8}
  position.x={5}
  position.y={10}
/>
<T.AmbientLight intensity={0.2} />

<Grid
  position.y={-0.001}
  cellColor="#ffffff"
  sectionColor="#ffffff"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
/>

<ContactShadows
  scale={10}
  blur={2}
  far={2.5}
  opacity={0.5}
/>

<Float
  floatIntensity={1}
  floatingRange={[0, 1]}
>
  <T.Mesh
    position.y={1.2}
    position.z={-0.75}
  >
    <T.BoxGeometry />
    <T.MeshStandardMaterial color="#0059BA" />
  </T.Mesh>
</Float>

<Float
  floatIntensity={1}
  floatingRange={[0, 1]}
>
  <T.Mesh
    position={[1.2, 1.5, 0.75]}
    rotation.x={5}
    rotation.y={71}
  >
    <T.TorusKnotGeometry args={[0.5, 0.15, 100, 12, 2, 3]} />
    <T.MeshStandardMaterial color="#F85122" />
  </T.Mesh>
</Float>

<Float
  floatIntensity={1}
  floatingRange={[0, 1]}
>
  <T.Mesh
    position={[-1.4, 1.5, 0.75]}
    rotation={[-5, 128, 10]}
  >
    <T.IcosahedronGeometry />
    <T.MeshStandardMaterial color="#F8EBCE" />
  </T.Mesh>
</Float> -->
