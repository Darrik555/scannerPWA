<script lang="ts">
  import { startScanner, scanBarcode, stopScanner } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement = $props();
  let stream: MediaStream;
  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);
  let barcodeValue: string = $state("");

  function handleScanning() {
    scanBarcode(video).then((response) => (barcodeValue = response ?? ""));
  }

  onMount(() => {
    isMounted = true;

    try {
      camaraController.start(video).then((result) => {
        stream = result.data.stream;
      });
    } catch (error) {
      console.log(error);
    }
  });

  onDestroy(() => {
    camaraController.stop(video, stream);
  });
</script>

<div>
  <video
    bind:this={video}
    onloadeddata={handleScanning}
    muted
    autoplay
    playsinline
  ></video>
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
