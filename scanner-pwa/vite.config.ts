import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { generateSW } from './pwa.mjs';

export default defineConfig({
	define: {
		'__DATE__': `'${new Date().toISOString()}'`,
    	'__RELOAD_SW__': false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' 
		  ? '"production"'
		  : '"development"'
	},
	plugins: [sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			strategies: generateSW ? 'generateSW' : 'injectManifest',
			filename: generateSW ? undefined : 'service-worker.ts',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest:	{
				"name": "ScannerPWA",
				"short_name": "scanner-pwa",
				"id": "/",
				"start_url": "/",
				"display": "standalone",
				"theme_color": "#ffffff",
				"background_color": "#000000",
				"icons": [
					{
					"sizes": "192x192",
					"src": "icon192.png",
					"type": "image/png"
					},
					{
					"sizes": "512x512",
					"src": "icon512.png",
					"type": "image/png"
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
			  globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
			},
			devOptions: {
			  enabled: true,
			  suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
			  type: 'module',
			  navigateFallback: '/',
			},
		})
	],
});
