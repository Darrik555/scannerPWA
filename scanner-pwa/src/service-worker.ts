/// <reference types="@sveltejs/kit" />

// @ts-nocheck
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files  // everything in `static`
];

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

async function saveSubscription(subscription) {
    const API_PATH = "/api/subscription";
    const response = await fetch(API_PATH, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription)
    });
    return response.json();
} 

self.addEventListener('install', async (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

    try{
        const applicationServerKey = urlB64ToUint8Array(
            "BIuD3JFVLjCFT3WDZ3fbh7bCW-XFaNCa7woQVp8Q6rfPBoIE6JVxW2U7fkUJGMfJe8EFUlF4AuQwL63N5eJzIr8"
        );
        const options = {applicationServerKey, userVisibleOnly: true};
        const subscription = await self.ServiceWorkerRegistration.pushManager.subscribe(options);
        const response = await saveSubscription(subscription);
    }catch(e){
        console.error("Error", e);
    }

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', async (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());

    try {
        const options = {}
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
      } catch (err) {
        console.log('Error', err)
      }
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

self.addEventListener('push', event => {
    const options = {
        body: 'New message received!',
        icon: '/static/icon192.png'
    };
    event.waitUntil(
        self.registration.showNotification('My App', options)
    );
});