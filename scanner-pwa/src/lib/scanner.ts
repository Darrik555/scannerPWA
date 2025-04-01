import { onDestroy } from "svelte";
import { BarcodeDetector as BarcodePonyfill, type BarcodeFormat } from "barcode-detector/ponyfill";

declare global {
    interface Window {
        BarcodeDetector?: typeof BarcodePonyfill;
    }
}

let barcodeDetector: BarcodePonyfill;

let stream: MediaStream | null;
let scanning = false;
const format = {
        formats: ["qr_code", "code_128", "ean_13","code_93"] as BarcodeFormat[]
};

// check compatibility
async function createBarcodeDetector() {
    if (window.BarcodeDetector == undefined) {
        alert("Native Barcode Detector is not supported by this browser. Use ponyfill");  
        return new BarcodePonyfill(format); 
    }

    const allSupportedFormats = await window.BarcodeDetector.getSupportedFormats();
    alert(allSupportedFormats);


    alert("Use Native Barcode Detector");
    return new window.BarcodeDetector(format);
}


export async function scanBarcode(){
    
    barcodeDetector = await createBarcodeDetector();
    async(video: HTMLVideoElement) => {
        try{
            stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment'}});
            video.srcObject = stream;
            scanning = true;
        }catch(error){
            console.error('Camera Error', error)
        }

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
}

export function stopScanner(){
    if(stream){
        stream.getTracks().forEach(track => track.stop());
    }
    scanning = false;
}

onDestroy(stopScanner);