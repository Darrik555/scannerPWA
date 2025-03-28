<script lang="ts">
    import { onDestroy } from "svelte";
    import { BarcodeDetector } from "barcode-detector";

    let video: HTMLVideoElement;
    let stream: MediaProvider | null;
    let scanning = false;

    // check compatibility
    async function startScanner() {
            if (!("BarcodeDetector" in window)) {
            alert("Barcode Detector is not supported by this browser.");  
            return; 
        }
        try{
            stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment'}});
            video.srcObject = stream;
            scanning = true;
            scanBarcode();
        }catch(error){
            console.error('Camera Error', error)
        }
    }

    async function scanBarcode() {
        const barcodeDetector = new BarcodeDetector({
            formats: ["qr_code", "codabar", "ean_13"]
        });

        while(scanning){
            try{
                const barcodes = await barcodeDetector.detect(video);
                if(barcodes.length > 0){
                    scanning = false;
                    alert('Barcode:' + barcodes[0].rawValue);
                    stopScanner();
                }
            }
            catch(error){
                console.error('Error on Scanning',error);
            }
            await new Promise(r => setTimeout(r, 500));
            }
        }
    

    function stopScanner(){
        if(stream){
            stream.getTracks().forEach(track => track.stop());
        }
        scanning = false;
    }

    onDestroy(stopScanner);
</script>

<div>
    <video bind:this={video} muted autoplay playsinline></video>
    <button on:click={startScanner}>Start</button>
    <button on:click={stopScanner}>Stop</button>
</div>

<style>
    video{
        width:100%;
        max-width:400px;
        border:2px solid #000;
    }
</style>