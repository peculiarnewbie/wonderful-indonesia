<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Sumatra from './sumatra.svelte';
	import '../../app.css';
</script>

<div class=" w-screen h-screen bg-sky-600">
	<Canvas>
		<!-- <Scene {height} /> -->
		<Sumatra />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}
</style>
