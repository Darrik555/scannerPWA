
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
    const unsupportedFormats = format.formats.filter((format) => !allSupportedFormats.includes(format));
    //alert(unsupportedFormats);


    alert("Use Native Barcode Detector");
    return new window.BarcodeDetector(format);
}


export async function startScanner(){
    


    async(video: HTMLVideoElement) => {
        try{
            stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment'}});
            video.srcObject = stream;
            scanning = true;
            scanBarcode(video)
        }catch(error){
            console.error('Error accessing the camera: ', error)
        }
    }
}

export async function scanBarcode(video: HTMLVideoElement) {

        barcodeDetector = await createBarcodeDetector();
        scanning = true
    
        while(scanning){
            try{
                const barcodes = await barcodeDetector.detect(video);
                if(barcodes.length > 0){
                    scanning = false;
                    stopScanner();
                    console.log("first format "+barcodes[0].format)
                    barcodes.forEach(element => {
                        console.log("Value " + element.rawValue);    
                    });
                    
                    return barcodes[0].rawValue;
                }
            }
            catch(error){
                console.error('Error on Scanning',error);
            }
            //await new Promise(r => setTimeout(r, 500));
    
        }
    
} 



export function stopScanner(){
    if(stream){
        stream.getTracks().forEach(track => track.stop());
    }
    scanning = false;
}
