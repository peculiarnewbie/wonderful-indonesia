export default function triggerDownload(data: any) {
	let jsonStr = JSON.stringify(data);
	let jsonBlob = new Blob([jsonStr], { type: 'application/json' });
	let url = URL.createObjectURL(jsonBlob);
	let link = document.createElement('a');
	link.href = url;
	link.download = 'data.json';
	link.click();
	URL.revokeObjectURL(url);
}
