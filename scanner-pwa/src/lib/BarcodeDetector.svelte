<script lang="ts">
  import { type DetectedBarcode } from "barcode-detector/ponyfill";
  import { scanBarcode } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement;
  let stream: MediaStream;
  let boundingBox: HTMLCanvasElement;
  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);
  let barcodeValue: string = $state("");

  function handleScanning() {
    scanBarcode(video).then((response) => (barcodeValue = response ?? ""));
  }
  function stopScanner() {
    camaraController.stop(video, stream);
  }
  function startScanner() {
    camaraController.start(video);
  }

  function onLocate(detectedCodes: DetectedBarcode[]) {
    const width = video.offsetWidth;
  }

  onMount(() => {
    isMounted = true;

    try {
      camaraController.start(video).then((result) => {
        //video = result.data.videoElement;
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
  <div>
    <video
      bind:this={video}
      onloadeddata={handleScanning}
      muted
      autoplay
      playsinline
    ></video>
    <canvas id="code-bounding-box" bind:this={boundingBox}> </canvas>
  </div>

  <input type="text" bind:value={barcodeValue} />
  <button onclick={startScanner}>Start</button>
  <button onclick={stopScanner}>Stop</button>
</div>

<style>
  video {
    width: 100%;
    height: 100%;
    max-width: 400px;
    border: 2px solid #000;
  }

  #code-bounding-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: #123;
  }
</style>
