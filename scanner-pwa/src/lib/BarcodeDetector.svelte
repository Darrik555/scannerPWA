<script lang="ts">
  import { scanBarcode } from "$lib/scanner";
  import { onDestroy, onMount } from "svelte";
  import * as camaraController from "$lib/camera";

  let video: HTMLVideoElement;
  let stream: MediaStream;
  let inputRef: HTMLInputElement;
  let container: HTMLDivElement;

  let isScanning = $state(false);
  let isTorchOn = $state(false);
  let barcodeValue: string = $state("");

  async function startScanning() {
    try {
      stream = await camaraController.start(video);
      isScanning = true;
      openFullscreen();

      const barcode = await scanBarcode(video);
      barcodeValue = barcode ?? "";
    } catch (error) {
      console.error("Error in startScanner()" + error);
    } finally {
      stopScanning();
    }
  }

  function stopScanning() {
    closeFullscreen();
    isScanning = false;
    camaraController.stop(video, stream);
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

  function onFullscreenChange() {
    if (document.fullscreenElement === null) {
      stopScanning();
    }
  }

  function torchToggle() {
    camaraController.toggleTorch(!isTorchOn);
    isTorchOn = !isTorchOn;
  }

  onMount(() => {
    inputRef.focus();
  });

  onDestroy(() => {
    camaraController.stop(video, stream);
    isScanning = false;
  });
</script>

<div
  class="container"
  class:hidden={!isScanning}
  bind:this={container}
  onfullscreenchange={onFullscreenChange}
>
  <video class="camera" bind:this={video} muted autoplay playsinline></video>
  <button class="round" id="cancel-button" onclick={stopScanning}>X</button>
  <button
    class="round"
    id="torch-button"
    class:hidden={!camaraController.hasTorchCapability}
    onclick={torchToggle}>&#x1F526</button
  >
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
  <button type="button" class="start-scanner-button" onclick={startScanning}
    >Start</button
  >
</div>

<style>
  .scanning-flexbox {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid gray;
    padding: 1px;
  }

  .container {
    width: 100%;
    height: 100%;
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
    object-fit: cover;
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

  .round {
    border: none;
    position: fixed;
    margin: 15px;
    padding: 5px;
    font-size: 40px;
    height: 80px;
    width: 80px;
    border-radius: 50%;
  }

  #cancel-button {
    color: white;
    background-color: rgb(201, 10, 10);
    bottom: 0;
    left: 0;
  }

  #torch-button {
    color: white;
    background-color: aqua;
    bottom: 0;
    right: 0;
  }
</style>
