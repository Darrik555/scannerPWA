<script lang="ts">
  import { scanBarcode, stopScanner } from "$lib/scanner";

  let video: HTMLVideoElement;
</script>

<div>
  <video bind:this={video} muted autoplay playsinline></video>
  <button on:click={scanBarcode}>Start</button>
  <button on:click={stopScanner}>Stop</button>
</div>

<style>
  video {
    width: 100%;
    max-width: 400px;
    border: 2px solid #000;
  }
</style>
