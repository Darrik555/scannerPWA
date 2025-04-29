<script lang="ts">
  import BarcodeDetector from "$lib/BarcodeDetector.svelte";
  import QrScanner from "$lib/QrScanner.svelte";
</script>

<h1>Welcome to SvelteKit</h1>
<div class="scanner">
  <!---<BarcodeDetector /> --->
  <QrScanner />
</div>

<style>
  .scanner {
    width: 100%;
  }
</style>
