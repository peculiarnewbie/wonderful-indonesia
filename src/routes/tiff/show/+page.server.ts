import { gzip, gunzip } from 'zlib';
// import * as gz from '../../lib/components/images/test.json.gz';
import dataJson from '../../lib/components/images/data.json';
import fs from 'fs';

export async function load({ fetch }) {
	let heightData: number[][] = new Array(2000);

	for (let i = 0; i < heightData.length; i++) {
		heightData[i] = new Array(2000); // Initialize the inner arrays with size 100
	}

	for (let i = 0; i < 2000; i++) {
		for (let j = 0; j < 2000; j++) {
			heightData[i][j] = 0;
		}
	}

	let canIT = false;

	Object.entries(dataJson).forEach((entry) => {
		const [key, value] = entry;
		Object.entries(value).forEach((entry2) => {
			const [key2, value2] = entry2;
			let i = key as number;
			let j = key2 as number;
			heightData[i][j] = value2;
		});
		// console.log(key, value);
	});

	// const json = await loadFromZip();

	return {
		heightData: heightData
	};

	// console.log('buff', res);
	// const json = await JSON.parse(res);
	// console.log('json: ', json);
	// heightData = json;
}

async function loadFromZip() {
	let res: string = '';

	let json;

	let event = false;

	async function assignFile(error, buff) {
		if (error != null) {
		} else {
			res = buff.toString();
			json = await JSON.parse(res);
			event = true;
		}
	}

	const data = fs.readFileSync('../../lib/components/images/test.json.gz', {
		encoding: 'binary'
	});

	const buffer = Buffer.from(data, 'binary');

	gunzip(buffer, assignFile);

	async function waitForEvent() {
		return new Promise(function (resolve, reject) {
			setInterval(function () {
				if (event) resolve('lezz goo');
			}, 100);
		});
	}

	await waitForEvent();

	console.log('whaat');

	return json;
}
