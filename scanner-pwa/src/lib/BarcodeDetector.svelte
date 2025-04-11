<script lang="ts">
  import { type DetectedBarcode } from "barcode-detector/ponyfill";
  import { continuousBarcodeScanning, scanBarcode } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement;
  let stream: MediaStream;
  let boundingBoxLayer: HTMLCanvasElement;
  let inputRef: HTMLInputElement;
  let container: HTMLDivElement;

  let isScanning = $state(false);
  let cameraActive = $state(false);
  let isMounted = $state(false);
  let barcodeValue: string = $state("");

  function scan() {
    startScanner();
    handleScanning();
    stopScanner();
  }

  function handleScanning() {
    scanBarcode(video, drawBoundingBox).then(
      (response) => (barcodeValue = response ?? "")
    );
    console.log("handlescanner after barcode");
  }

  function startScanner() {
    try {
      camaraController.start(video).then((result) => {
        stream = result.data.stream;
        isScanning = true;
        //cameraActive = true;
        openFullscreen();
        console.log("start camera");
      });
    } catch (error) {
      console.error("Error in startScanner()" + error);
    }
  }

  function stopScanner() {
    try {
      console.log("in stopscanner");
      closeFullscreen();
      isScanning = false;
      camaraController.stop(video, stream);
    } catch (error) {
      console.error("Error in stopScanner()" + error);
    }
  }

  $effect(() => {
    if (cameraActive) {
      continuousBarcodeScanning(video, drawBoundingBox).then((response) => {
        console.log(response);
      });
    }
  });

  function clearCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawBoundingBox(detectedCodes: DetectedBarcode[]) {
    boundingBoxLayer.width = video.videoWidth;
    boundingBoxLayer.height = video.videoHeight;
    const ctx = boundingBoxLayer.getContext("2d") as CanvasRenderingContext2D;

    clearCanvas(boundingBoxLayer);

    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height },
      } = detectedCode;

      console.log(x, y, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, width, height);
    }
  }

  function openFullscreen() {
    const elem = container;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      // @ts-expect-error
    } else if (elem.mozRequestFullScreen) {
      // @ts-expect-error
      elem.mozRequestFullScreen();
      // @ts-expect-error
    } else if (elem.webkitRequestFullscreen) {
      // @ts-expect-error
      elem.webkitRequestFullscreen();
      // @ts-expect-error
    } else if (elem.msRequestFullscreen) {
      // @ts-expect-error
      elem.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      // @ts-expect-error}
    } else if (document.mozCancelFullScreen) {
      // @ts-expect-error
      document.mozCancelFullScreen();
      // @ts-expect-error
    } else if (document.webkitExitFullscreen) {
      // @ts-expect-error
      document.webkitExitFullscreen();
      // @ts-expect-error
    } else if (document.msExitFullscreen) {
      // @ts-expect-error
      document.msExitFullscreen();
    }
  }

  onMount(() => {
    isMounted = true;

    inputRef.focus();
  });

  onDestroy(() => {
    camaraController.stop(video, stream);
    cameraActive = false;
    isScanning = false;
  });
</script>

<div class="container" class:hidden={!isScanning} bind:this={container}>
  <video class="camera" bind:this={video} muted autoplay playsinline></video>
  <canvas class="overlay" bind:this={boundingBoxLayer}> </canvas>
</div>

<label for="barcodeInput">Scan ID</label>
<div class="scanning-flexbox">
  <input
    type="text"
    class="barcodeInput"
    id="barcodeInput"
    bind:value={barcodeValue}
    bind:this={inputRef}
  />
  <button type="button" class="start-scanner-button" onclick={scan}
    >Start</button
  >
</div>

<button onclick={stopScanner}>Stop</button>

<style>
  .scanning-flexbox {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid gray;
    padding: 1px;
  }

  .container {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .camera {
    width: 100%;
    height: 100%;
  }

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .hidden {
    visibility: hidden;
  }

  input {
    flex-grow: 2;
    border: none;
  }

  input:focus {
    outline: none;
  }

  .start-scanner-button {
    border: 1px solid grey;
  }
</style>
