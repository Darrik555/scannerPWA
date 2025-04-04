<script lang="ts">
  import { type DetectedBarcode } from "barcode-detector/ponyfill";
  import { scanBarcode } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement;
  let stream: MediaStream;
  let boundingBoxLayer: HTMLCanvasElement;
  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);
  let barcodeValue: string = $state("");

  function handleScanning() {
    scanBarcode(video, drawBoundingBox).then(
      (response) => (barcodeValue = response ?? "")
    );
  }
  function stopScanner() {
    camaraController.stop(video, stream);
  }
  function startScanner() {
    camaraController.start(video);
  }

  function drawBoundingBox(detectedCodes: DetectedBarcode[]) {
    boundingBoxLayer.width = video.offsetWidth;
    boundingBoxLayer.height = video.offsetHeight;
    const ctx = boundingBoxLayer.getContext("2d") as CanvasRenderingContext2D;

    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height },
      } = detectedCode;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, width, height);
    }
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
  <div class="container">
    <video
      class="camera"
      bind:this={video}
      onloadeddata={handleScanning}
      muted
      autoplay
      playsinline
    ></video>
    <canvas class="overlay" bind:this={boundingBoxLayer}> </canvas>
  </div>

  <input type="text" bind:value={barcodeValue} />
  <button onclick={startScanner}>Start</button>
  <button onclick={stopScanner}>Stop</button>
</div>

<style>
  .container {
    margin: 0 auto;
    position: relative;
  }

  .camera {
    width: 100%;
    height: 100%;
    max-width: 400px;
    border: 2px solid #000;
  }

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: #123;
  }
</style>
