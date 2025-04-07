<script lang="ts">
  import BarcodeDetector from "$lib/BarcodeDetector.svelte";
</script>

<h1>Welcome to SvelteKit</h1>
<div class="scanner">
  <BarcodeDetector />
</div>

<style>
  .scanner {
    width: 100%;
  }
</style>
