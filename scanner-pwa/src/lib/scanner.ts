
import { BarcodeDetector as BarcodePonyfill, type BarcodeFormat, type DetectedBarcode } from "barcode-detector/ponyfill";

declare global {
    interface Window {
        BarcodeDetector?: typeof BarcodePonyfill;
    }
}

const format = {
        formats: ["qr_code", "code_128", "code_39","data_matrix"] as BarcodeFormat[]
};

let barcodeDetector: BarcodePonyfill;

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

export async function scanBarcode(video: HTMLVideoElement) {
    console.log(barcodeDetector);
    barcodeDetector = await createBarcodeDetector();

    return new Promise<string | null>((resolve,reject) => {
        const barcodeFrame = (then: number) => async (now: number) =>  {
            if(video.readyState !== 0){
                try{
                    if(now - then > 1000 / 25){
                        const detectedBarcodes = await barcodeDetector.detect(video);
            
                        if (detectedBarcodes.length > 0){
                            resolve(detectedBarcodes[0].rawValue);
                            return;
                        }
                        window.requestAnimationFrame(barcodeFrame(now));
                    }else{
                        window.requestAnimationFrame(barcodeFrame(then));
                    }
                }catch(error){
                    console.error('Error on Scanning', error);
                    reject(error);
                    return;
                }
            }else{
                window.requestAnimationFrame(barcodeFrame(now));
            }   
        }
        barcodeFrame(window.performance.now())(window.performance.now());
    })
    
}
               
    
export async function continuousBarcodeScanning(video: HTMLVideoElement, drawHandler:  DrawHandler){
    barcodeDetector = await createBarcodeDetector();

    const barcodeFrame = (then: number) => async (now: number) =>  {
        console.log("time diff "+ (now - then));
        if(video.readyState !== 0){
            try{
                if(now - then > 1000 / 25){
                    const detectedBarcodes = await barcodeDetector.detect(video);
        
                    if (detectedBarcodes.length > 0){
                        console.log("Barcodes: " + detectedBarcodes);
                        drawHandler(detectedBarcodes);
                    }
                    window.requestAnimationFrame(barcodeFrame(now));
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