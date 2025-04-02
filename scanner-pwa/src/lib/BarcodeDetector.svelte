<script lang="ts">
  import { startScanner, scanBarcode, stopScanner } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement = $props();
  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);
  let barcodeValue: string = $state("");

  onMount(() => {
    isMounted = true;

    try {
      camaraController.start(video);
      scanBarcode(video).then((response) => (barcodeValue = response ?? ""));
    } catch (error) {
      console.log("TEST" + error);
    }
  });

  onDestroy(() => {
    stopScanner();
  });
</script>

<div>
  <video bind:this={video} muted autoplay playsinline></video>
  <input type="text" bind:value={barcodeValue} />
  <button onclick={startScanner}>Start</button>
  <button onclick={stopScanner}>Stop</button>
</div>

<style>
  video {
    width: 100%;
    max-width: 400px;
    border: 2px solid #000;
  }
</style>
