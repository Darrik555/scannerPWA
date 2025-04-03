export async function start(videoElement: HTMLVideoElement){
    // frameRate? frameRate: { ideal: 10, max: 15 }
    const constraints = {
        audio: false,
        video: { width: 1280, height: 720, facingMode: 'environment' }
      };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
        console.log("loadedmeta in videoelement");
        videoElement.play();
    }

    const [track] = stream.getVideoTracks();
    const capabilities: Partial<MediaTrackCapabilities> = track?.getCapabilities?.() ?? {};
    
    return{data: {videoElement, stream, capabilities}};
}

export function stop(videoElement: HTMLVideoElement, stream: MediaStream) {
    if(videoElement){
        videoElement.pause();
        videoElement.removeAttribute('srcObject');
        videoElement.removeAttribute('src');
        videoElement.load();
    }

    stream.getTracks().forEach(track => 
        {
            stream.removeTrack(track);
            track.stop();
        });
}