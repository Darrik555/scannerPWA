<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import L from "leaflet";

  let mapElement: HTMLElement;
  let map: L.Map;

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      map = L.map(mapElement).setView(
        [userPosition.latitude, userPosition.longitude],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      L.marker([userPosition.latitude, userPosition.longitude]).addTo(map);
    });
  });

  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });
</script>

<svelte:head
  ><link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  /></svelte:head
>
<h1>Map</h1>
<div id="map" bind:this={mapElement}></div>

<style>
  #map {
    position: absolute;
    bottom: 0;
    height: 50%;
    width: 100%;
  }
</style>
