import { type DetectedBarcode } from "barcode-detector/ponyfill";

function clearCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

function drawBoundingBox(boundingBoxLayer: HTMLCanvasElement, video: HTMLVideoElement, detectedCodes: DetectedBarcode[]) {
    boundingBoxLayer.width = video.videoWidth;
    boundingBoxLayer.height = video.videoHeight;
    const ctx = boundingBoxLayer.getContext("2d") as CanvasRenderingContext2D;

    clearCanvas(boundingBoxLayer);

    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height },
      } = detectedCode;

      console.log(x, y, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, width, height);
    }
}
