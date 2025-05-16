<script lang="ts">
  import { onMount } from "svelte";
  import { addFeaturesToMap, createMap, updatePosition } from "./map";
  import { watchPosition } from "./geolocationUtils";

  let map: any;
  let mapContainer: HTMLDivElement;

  onMount(async () => {
    try {
      const targetCoords: [number, number] = [6.955838, 50.936693];

      map = createMap(mapContainer, targetCoords);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentPosition: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          addFeaturesToMap(map, currentPosition, targetCoords);
        },
        (err) => {
          console.error("Error on inital location", err);
        },
        { enableHighAccuracy: true }
      );

      await watchPosition((coords) => {
        updatePosition(map, coords);
      });
    } catch (err) {
      console.error("Error on map init", err);
    }
  });
</script>

<h1>Map</h1>
<div id="map" bind:this={mapContainer}></div>

<style>
  #map {
    position: absolute;
    bottom: 0;
    height: 50%;
    width: 100%;
  }
</style>
