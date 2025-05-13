<script lang="ts">
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";

  let map: L.Map;

  onMount(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      map = L.map("map").setView(
        [userPosition.latitude, userPosition.longitude],
        5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 20,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      L.marker([userPosition.latitude, userPosition.longitude]).addTo(map);
    });
  });
</script>

<h1>Map</h1>
<div id="map"></div>

<style>
  #map {
    position: absolute;
    bottom: 0;
    height: 50%;
    width: 100%;
  }
</style>
