<script lang="ts">
	import App from '$lib/components/App.svelte';
	import Main from './Main.svelte';
	import { Canvas } from '@threlte/core';
	import { rebuildPlot, combinePlots } from '$lib/mapBuilder';
	import '../app.css';
	import plot1 from '../lib/components/plots/plot1.json';
	import plot2 from '../lib/components/plots/plot2.json';
	import plot3 from '../lib/components/plots/plot3.json';
	import plot4 from '../lib/components/plots/plot4.json';

	import { onMount, tick } from 'svelte';

	let heightData: number[][];

	let blocks: { x: number; y: number; h: number }[] = [];

	let res: number = 100;

	let isHover = false;

	const picRes = 2000;

	const initialBuild = async () => {
		const plots = [
			{ plot: plot1, xOffset: 0, yOffset: 0 },
			{ plot: plot2, xOffset: 1, yOffset: 0 },
			{ plot: plot3, xOffset: 0, yOffset: 1 },
			{ plot: plot4, xOffset: 1, yOffset: 1 }
		];
		heightData = combinePlots(plots, 1000);
		console.log(heightData);
		blocks = await rebuildPlot(heightData, picRes, 100);
	};

	const rebuild = async (resolution: number) => {
		isBlur = true;
		await tick();
		setTimeout(() => {
			clearBlocks(resolution);
		}, 100);
	};

	const clearBlocks = async (resolution: number) => {
		blocks = [];
		await tick();
		setTimeout(() => {
			rebuildBlocks(resolution);
		}, 100);
	};

	const rebuildBlocks = async (resolution: number) => {
		res = resolution;
		blocks = await rebuildPlot(heightData, picRes, res);
		isBlur = false;
	};

	let defaultH = 100;
	let hoverIndex = -1;
	let activeIndex = -1;

	let hoveredProvince = ' ';

	let isBlur = false;

	let provinces = [
		{
			name: 'Aceh',
			code: 'Aceh',
			h: defaultH,
			mat: '#a1d2ce',
			x: 30,
			y: -55,
			city: 'Banda Aceh',
			population: '5.372',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Coat_of_arms_of_Aceh.svg/118px-Coat_of_arms_of_Aceh.svg.png',
			notes:
				'The westernmost province of Indonesia. The province is granted a special autonomous status, Aceh is a religiously conservative territory and the only Indonesian province practicing the Sharia law officially.'
		},
		{
			name: 'Sumatera Utara',
			code: 'Medan',
			h: defaultH,
			mat: '#78cad2',
			x: 5,
			y: -30,
			city: 'Medan',
			population: '14.56',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Coat_of_arms_of_North_Sumatra.svg/96px-Coat_of_arms_of_North_Sumatra.svg.png',
			notes:
				"English: North Sumatra. North Sumatra is Indonesia's fourth most populous province and the most populous in Sumatra"
		},
		{
			name: 'Sumatera Barat',
			code: 'Sumbar',
			h: defaultH,
			mat: '#a1d2ce',
			x: -10,
			y: 10,
			city: 'Padang',
			population: '5.534',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Coat_of_arms_of_West_Sumatra.svg/105px-Coat_of_arms_of_West_Sumatra.svg.png',
			notes:
				"English: West Sumatra. This is where I live (hi btw). West Sumatra is home to the Minangkabau people, although the traditional Minangkabau region is actually wider than the province's boundaries"
		},
		{
			name: 'Bengkulu',
			code: 'Bengkulu',
			h: defaultH,
			mat: '#50858b',
			x: -25,
			y: 40,
			city: 'Bengkulu',
			population: '1.972',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Coat_of_arms_of_Bengkulu.svg/95px-Coat_of_arms_of_Bengkulu.svg.png',
			notes:
				'This province was was formed on 18 November 1968 by separating out the area of the historic Bencoolen Residency from the province of South Sumatra'
		},
		{
			name: 'Riau',
			code: 'Riau',
			h: defaultH,
			mat: '#50858b',
			x: -20,
			y: -10,
			city: 'Pekanbaru',
			population: '6.835',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Coat_of_arms_of_Riau.svg/81px-Coat_of_arms_of_Riau.svg.png',
			notes:
				'Riau is very rich in natural resources, particularly petroleum, natural gas, rubber, palm oil and fibre plantations'
		},
		{
			name: 'Jambi',
			code: 'Jambi',
			h: defaultH,
			mat: '#5497a7',
			x: -40,
			y: 15,
			city: 'Jambi',
			population: '3.566',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coat_of_arms_of_Jambi.svg/115px-Coat_of_arms_of_Jambi.svg.png',
			notes:
				'Jambi was the site of the Melayu kingdom that engaged in trade throughout the Strait of Malacca and beyond. It was recorded as having sent a mission to China in 644 CE'
		},
		{
			name: 'Lampung',
			code: 'Lampung',
			h: defaultH,
			mat: '#78cad2',
			x: -55,
			y: 65,
			city: 'Bandar Lampung',
			population: '8.458',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Coat_of_arms_of_Lampung.svg/81px-Coat_of_arms_of_Lampung.svg.png',
			notes:
				'The volcano of Krakatoa is located in this province in the Sunda Strait. In 1883, it suffered one of the most violent volcanic eruptions in recorded history, with disastrous consequences for the area and elsewhere, including estimates of human fatalities in the tens of thousands, and worldwide temperature and other weather effects for years.'
		},
		{
			name: 'Sumatera Selatan',
			code: 'Sumsel',
			h: defaultH,
			mat: '#62a8ac',
			x: -50,
			y: 40,
			city: 'Palembang',
			population: '8.497',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Coat_of_arms_of_South_Sumatra.svg/93px-Coat_of_arms_of_South_Sumatra.svg.png',
			notes:
				'English: South Sumatra. It is the largest province in the island of Sumatra, and it is slightly larger than Hungary. It was also home to one of the largest Indonesian kingdoms, Srivijaya'
		},
		{
			name: 'Bangka Belitung',
			code: 'Babel',
			h: defaultH,
			mat: '#5497a7',
			x: -75,
			y: 35,
			city: 'Pangkalpinang',
			population: '1.431',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Bangka_Belitung_Islands.svg/96px-Coat_of_arms_of_Bangka_Belitung_Islands.svg.png',
			notes:
				'Bangka Belitung has numerous beaches and several small islands. Some beaches are famous for their natural attractiveness with blue sea waters, variety of coral reefs, white sand, and giant granite rock formations.'
		},
		{
			name: 'Kepulauan Riau',
			code: 'Kepri',
			h: defaultH,
			mat: '#62a8ac',
			x: -75,
			y: -15,
			city: 'Tanjung Pinang',
			population: '2.242',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Coat_of_arms_of_Riau_Islands.svg/90px-Coat_of_arms_of_Riau_Islands.svg.png',
			notes:
				'English: Riau Islands. \n The islands separated from the Riau Province in 2002. The english wikipedia of this province is weirdly way way more detailed than the other provinces in Sumatra. Do check it out'
		}
	];

	$: {
		if (hoverIndex == -1) hoveredProvince = ' ';
		else hoveredProvince = provinces[hoverIndex].name;
	}

	onMount(() => {
		initialBuild();
	});
</script>

<div class=" w-screen h-screen BG">
	<div class="p-4 absolute w-80 z-10 gap-5 flex flex-col">
		<div class="p-2 gap-2 flex flex-col bg-neutral-500 rounded-md">
			<div class="text-lg font-semibold">select resolution:</div>
			<div class="flex gap-2">
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(50);
					}}
				>
					50
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(100);
					}}
				>
					100
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(200);
					}}
				>
					200
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(500);
					}}
				>
					500
				</button>
				<button
					class="p-2 bg-slate-200 rounded-md w-12"
					on:click={() => {
						rebuild(1000);
					}}
				>
					1000
				</button>
			</div>
			<div class="text-sm">
				{'500 and 1000 resolutions might result in choppy interactions'}
			</div>
			<!-- <div>province: {hoveredProvince}</div>
			<div class=" p-4 rounded-full hover:rounded-none bg-white" /> -->
		</div>
		<div class="w-72 h-fit min-h-[64px] bg-neutral-500 rounded-md flex">
			{#if activeIndex == -1}
				<div
					class=" self-center justify-self-center align-middle w-full flex justify-center font-semibold"
				>
					<div>Select a province</div>
				</div>
			{:else}
				<div class="flex flex-col p-4 w-full gap-4">
					<div class="w-20 h-20 self-center">
						<img class="w-full h-full" src={provinces[activeIndex].icon} alt="province logo" />
					</div>
					<p class=" text-2xl font-semibold self-center text-center">
						{provinces[activeIndex].name}
					</p>
					<div>
						<p class=" text-base font-semibold">Capital city: {provinces[activeIndex].city}</p>
						<p class=" text-base font-semibold">
							Population: {provinces[activeIndex].population} million
						</p>
					</div>
					<p>{provinces[activeIndex].notes}</p>
				</div>
			{/if}
		</div>
	</div>
	{#if isBlur}
		<div class="w-screen h-screen backdrop-blur-sm absolute" />
		<div class="w-screen h-screen flex justify-center items-center absolute">
			<div class="bg-neutral-400 rounded-md h-fit w-fit p-4 px-8">Loading...</div>
		</div>
	{/if}
	<div class={`w-screen h-screen ${isHover ? 'cursor-pointer' : ''}`}>
		<Canvas>
			<Main
				{blocks}
				{res}
				bind:provinces
				{defaultH}
				bind:hoverIndex
				bind:isBlur
				bind:isHover
				bind:activeIndex
			/>
		</Canvas>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}
	.BG {
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>
