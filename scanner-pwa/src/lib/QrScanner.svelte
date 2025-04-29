<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Html5Qrcode } from "html5-qrcode";

  let html5QrcodeScanner: Html5Qrcode;

  function onScanSuccess(decodedText: string, decodedResult: any) {}

  function onScanFailure(error: any) {
    console.warn(`Code scan error = ${error}`);
  }

  onMount(() => {
    html5QrcodeScanner = new Html5Qrcode("qr-reader");

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch((err) => console.error("Start failed", err));
  });

  onDestroy(() => {
    if (html5QrcodeScanner) {
      html5QrcodeScanner
        .stop()
        .then(() => {
          html5QrcodeScanner.clear();
        })
        .catch((err) => console.error("Stop failed", err));
    }
  });
</script>

<div id="qr-reader"></div>
