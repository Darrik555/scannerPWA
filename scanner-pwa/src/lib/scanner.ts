
import { BarcodeDetector as BarcodePonyfill, type BarcodeFormat, type DetectedBarcode } from "barcode-detector/ponyfill";

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
        console.log("Native Barcode Detector is not supported by this browser. Use ponyfill");  
        return new BarcodePonyfill(format); 
    }

    const allSupportedFormats = await window.BarcodeDetector.getSupportedFormats();
    const unsupportedFormats = format.formats.filter((format) => !allSupportedFormats.includes(format));
    if(unsupportedFormats.length > 0){
        console.log("At least one barcode format not supported")
        return new BarcodePonyfill(format); 
    }
    
    console.log("Use Native Barcode Detector");
    return new window.BarcodeDetector(format);
}

type DrawHandler = (barcodes: DetectedBarcode[]) => void;

export async function scanBarcode(video: HTMLVideoElement, drawHandler:  DrawHandler ) {

        barcodeDetector = await createBarcodeDetector();
        scanning = true
    
        while(scanning){
            try{
                const barcodes = await barcodeDetector.detect(video);
                if(barcodes.length > 0){
                    scanning = false;
                    console.log("first format "+barcodes[0].format)
                    barcodes.forEach(element => {
                        console.log("Value " + element.rawValue);    
                    });
                    drawHandler(barcodes);
                    
                    return barcodes[0].rawValue;
                }
            }
            catch(error){
                console.error('Error on Scanning',error);
            }
            await new Promise(r => setTimeout(r, 500));
    
        }
    
} 

export async function continuousBarcodeScanning(video: HTMLVideoElement, drawHandler:  DrawHandler){
    barcodeDetector = await createBarcodeDetector();

    const barcodeFrame = (then: number) => async (now: number) =>  {
        //console.log("enter barcodeFrame()");
        if(video.readyState !== 0){
            try{
                if(now - then < 1000 / 25){
                    const detectedBarcodes = await barcodeDetector.detect(video);
        
                    if (detectedBarcodes.length > 0){
                        console.log("Barcodes: " + detectedBarcodes);
                        drawHandler(detectedBarcodes);
                        window.requestAnimationFrame(barcodeFrame(now));
                    }
                }else{
                    window.requestAnimationFrame(barcodeFrame(then));
                }
                
            }catch(error){
                console.error('Error on Scanning', error);
            }
        }
        //console.log("enter barcodeFrame() back");
        //window.requestAnimationFrame(barcodeFrame(then));
    }
    barcodeFrame(window.performance.now())(window.performance.now());
}
