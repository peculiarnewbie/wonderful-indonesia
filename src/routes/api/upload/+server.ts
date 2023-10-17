import { convertTIFF } from '$lib/tiffConvert.js';
import { json } from '@sveltejs/kit';
import fs, { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST({ request, cookies }) {
	// console.log('==================== \n request: ', request);
	const formData = await request.formData();
	// console.log('==================== \n formData: ', formData);
	const file = formData.get('file');

	// Perform file validation here
	if (file) {
		const filePath = join('static', file.name);
		// const buffer = Buffer.from(file.toString(), 'binary');
		// writeFileSync(filePath, new Uint8Array(await file.arrayBuffer()));

		const data = await file.arrayBuffer();

		const buffer = Buffer.from(data, 'binary');

		const jsonData = await convertTIFF(buffer);

		// console.log('==================== file: ', jsonData);

		const result = 'we did it';

		// Return the path to the uploaded file
		return json({ jsonData }, { status: 200 });
	}
}
