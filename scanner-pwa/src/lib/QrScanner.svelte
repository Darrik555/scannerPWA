<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

  let html5QrcodeScanner: Html5Qrcode;
  let inputRef: HTMLInputElement;
  let container: HTMLDivElement;

  let isScanning = $state(false);
  let isTorchOn = $state(false);
  let barcodeValue: string = $state("");

  function onScanSuccess(decodedText: string, decodedResult: any) {
    barcodeValue = decodedText;
    stopScanning();
  }

  function onScanFailure(error: any) {
    console.warn(`Code scan error = ${error}`);
  }

  function startScanning() {
    const config = { fps: 24, aspectRatio: 1.777778 };

    isScanning = true;
    html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch((err) => {
        isScanning = false;
        console.error("Start failed", err);
      });
  }

  function stopScanning() {
    if (html5QrcodeScanner) {
      isScanning = false;
      html5QrcodeScanner
        .stop()
        .then(() => {
          html5QrcodeScanner.clear();
        })
        .catch((err) => console.error("Stop failed", err));
    }
  }

  async function toggleTorch() {
    if (html5QrcodeScanner) {
      let torchCapability = html5QrcodeScanner
        .getRunningTrackCameraCapabilities()
        .torchFeature();
      if (torchCapability.isSupported()) {
        await torchCapability.apply(!isTorchOn);
        isTorchOn = !isTorchOn;
      }
    }
  }

  onMount(() => {
    inputRef.focus();

    html5QrcodeScanner = new Html5Qrcode("qr-reader", {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.CODE_128,
      ],
      useBarCodeDetectorIfSupported: true,
      verbose: false,
    });
  });

  onDestroy(() => {
    stopScanning();
  });
</script>

<div class="container" class:hidden={!isScanning} bind:this={container}>
  <div id="qr-reader"></div>
  <button class="round" id="cancel-button" onclick={stopScanning}>X</button>
  <button class="round" id="torch-button" onclick={toggleTorch}>&#x1F526</button
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
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
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
