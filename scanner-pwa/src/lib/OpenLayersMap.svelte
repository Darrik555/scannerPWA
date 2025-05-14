<script lang="ts">
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import OSM from "ol/source/OSM.js";
  import TileLayer from "ol/layer/Tile.js";
  import View from "ol/View.js";
  import Feature from "ol/Feature";
  import { Point } from "ol/geom";
  import { fromLonLat } from "ol/proj";
  import { Vector as VectorSource } from "ol/source";
  import { Vector as VectorLayer } from "ol/layer";

  let map;
  let mapContainer: HTMLElement;

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      map = new Map({
        target: mapContainer,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          projection: "EPSG:4326",
          center: fromLonLat([userPosition.longitude, userPosition.latitude]),
          zoom: 13,
        }),
      });
      const feature = new Feature(
        new Point(fromLonLat([userPosition.longitude, userPosition.latitude]))
      );
      const vectorSource = new VectorSource({ features: [feature] });
      const markerVectorLayer = new VectorLayer({ source: vectorSource });
      map.addLayer(markerVectorLayer);
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
