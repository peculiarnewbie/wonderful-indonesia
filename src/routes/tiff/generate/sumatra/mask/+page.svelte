<script lang="ts">
	import { onMount } from 'svelte';
	import image from '$lib/components/images/Mask4.png';
	import triggerDownload from '$lib/download';

	let canvas: HTMLCanvasElement;
	onMount(() => {
		canvas.id = 'maskCanvas';
		const ctx = canvas.getContext('2d');

		const img = new Image();
		img.onload = function () {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);

			let vals = [];
			let isWhite = false;
			let count = 0;
			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for (let i = 0; i < imgData.data.length; i += 4) {
				const red = imgData.data[i];
				const green = imgData.data[i + 1];
				const blue = imgData.data[i + 2];
				const alpha = imgData.data[i + 3];
				if (red > 0) {
					if (!isWhite) {
						vals.push(count);
						isWhite = true;
						count = 1;
					} else {
						count++;
					}
				} else {
					if (isWhite) {
						vals.push(count);
						isWhite = false;
						count = 1;
					} else {
						count++;
					}
				}
				// Now you can work with the RGBA values
			}
			console.log(vals);
			triggerDownload(vals);
		};
		img.src = image; // Replace with your image source
	});
</script>

<div>
	<canvas bind:this={canvas} />
</div>
