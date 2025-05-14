<script lang="ts">
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import OSM from "ol/source/OSM.js";
  import TileLayer from "ol/layer/Tile.js";
  import View from "ol/View.js";

  let map;
  let mapContainer: HTMLElement;

  onMount(() => {
    map = new Map({
      target: mapContainer,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
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
