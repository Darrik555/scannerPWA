<script lang="ts">
  import BarcodeDetector from "$lib/BarcodeDetector.svelte";
  import QrScanner from "$lib/QrScanner.svelte";
</script>

<h1>BarcodeDetector with Ponyfill</h1>
<div class="scanner">
  <BarcodeDetector />
  <!---  --->
  <h1>BarcodeDetector with Html5-qrcode</h1>
  <QrScanner />
</div>

<style>
  .scanner {
    width: 100%;
  }
</style>
