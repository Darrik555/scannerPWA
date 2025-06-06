import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
//import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
    ({ url }) => url.origin === self.location.origin,
    new NetworkFirst({
        cacheName: 'app-cache',
       // plugins: [
       //     new ExpirationPlugin({
       //         maxAgeSeconds: 60 * 60 * 24 * 30,
       //         maxEntries: 50
       //     })
     //   ]
    })
);

// Handle service worker updates immediately
addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
});

// Push Notifications
self.addEventListener('push', event => {
	const data = event.data.json() || {};
	const title = data.title || 'New message';
    const options = {
        body: data.body || 'New message received!',
        icon: '/icon192.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});