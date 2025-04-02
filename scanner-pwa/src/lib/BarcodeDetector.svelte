<script lang="ts">
  import { startScanner, scanBarcode, stopScanner } from "$lib/scanner";
  import { onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement = $props();
  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);

  onMount(() => {
    isMounted = true;

    try {
      camaraController.start(video);
      scanBarcode(video);
    } catch (error) {
      console.log(error);
    }
  });
</script>

<div>
  <video bind:this={video} muted autoplay playsinline></video>
  <button on:click={startScanner}>Start</button>
  <button on:click={stopScanner}>Stop</button>
</div>

<style>
  video {
    width: 100%;
    max-width: 400px;
    border: 2px solid #000;
  }
</style>
