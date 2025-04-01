<script lang="ts">
  import { startScanner, stopScanner } from "$lib/scanner";
  let video: HTMLVideoElement;
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
