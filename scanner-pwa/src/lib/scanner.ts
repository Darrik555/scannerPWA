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
    if(!barcodeDetector == undefined) return;

    if (window.BarcodeDetector == undefined) {
        console.log("Native Barcode Detector is not supported by this browser. Use ponyfill");  
        barcodeDetector = new BarcodePonyfill(format); 
    }else{
        const allSupportedFormats = await window.BarcodeDetector.getSupportedFormats();
        const unsupportedFormats = format.formats.filter((format) => !allSupportedFormats.includes(format));
        if(unsupportedFormats.length > 0){
            console.log("At least one barcode format not supported")
            barcodeDetector = new BarcodePonyfill(format); 
        }
        
        console.log("Use Native Barcode Detector");
        barcodeDetector = new window.BarcodeDetector(format);
    }
}

export async function scanBarcode(video: HTMLVideoElement) {
    await createBarcodeDetector();
    console.log(barcodeDetector);
    const scan = async () => {
        if(video.readyState !== 0){
            try{
                const detectedBarcodes = await barcodeDetector.detect(video);
                if (detectedBarcodes.length > 0){
                      return detectedBarcodes[0].rawValue;
                }            
            }catch(error){
                console.error('Error on Scanning', error);
            } 
        }
        
        requestAnimationFrame(scan);
    };
    scan();
}
               

type DrawHandler = (barcodes: DetectedBarcode[]) => void;

export async function continuousBarcodeScanning(video: HTMLVideoElement, drawHandler:  DrawHandler){
    await createBarcodeDetector();

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