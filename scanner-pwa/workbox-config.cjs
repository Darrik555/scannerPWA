module.exports = {
	globDirectory: '.svelte-kit/output/client',
	globPatterns: [
		'**/*.{html,js,png}'
	],
	swDest: 'build/service-worker.js',
	swSrc: 'src/service-worker.js'
};