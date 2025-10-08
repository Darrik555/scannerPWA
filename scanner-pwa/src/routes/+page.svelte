<script lang="ts">
  import BarcodeDetector from "$lib/BarcodeDetector.svelte";
  export let data: {
    role: string | null;
  };
</script>

<h1>BarcodeDetector with Ponyfill</h1>
<div class="scanner">
  <BarcodeDetector />
  <!---  --->
</div>

<style>
  .scanner {
    width: 100%;
  }
</style>
