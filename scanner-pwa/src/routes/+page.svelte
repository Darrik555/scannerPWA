<script lang="ts">
  import BarcodeDetector from "$lib/BarcodeDetector.svelte";
  import QrScanner from "$lib/QrScanner.svelte";

  export let data: {
    role: string | null;
  };
</script>

{#if data.role === "scanner"}
  <h1>BarcodeDetector with Ponyfill</h1>
  <div class="scanner">
    <BarcodeDetector />
    <!---  --->
    <h1>BarcodeDetector with Html5-qrcode</h1>
    <QrScanner />
  </div>
{:else}
  <p>Kein Zugriff</p>
{/if}

<style>
  .scanner {
    width: 100%;
  }
</style>
