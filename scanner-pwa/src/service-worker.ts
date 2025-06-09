/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
//import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope

// Handle service worker updates immediately
addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  { allowlist },
))

// Push Notifications
self.addEventListener('push', event => {
    if(event.data !== null){
        const data = event.data.json() || {};
        const title = data.title || 'New message';
        const options = {
            body: data.body || 'New message received!',
            icon: '/icon192.png'
        };
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});