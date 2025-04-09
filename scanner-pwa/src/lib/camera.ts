
let stream: MediaStream | null;

export async function start(videoElement: HTMLVideoElement){
    // frameRate? frameRate: { ideal: 10, max: 15 }
    const constraints = {
        audio: false,
        video: { width: 1280, height: 720, facingMode: 'environment' }
      };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    videoElement.srcObject = stream;

    await new Promise((resolve) => {
        resolve(
        videoElement.onloadeddata = () => {
            console.log("loadeddata in videoelement");
            videoElement.play();
        });
    });

    const [track] = stream.getVideoTracks();
    const capabilities: Partial<MediaTrackCapabilities> = track?.getCapabilities?.() ?? {};
    
    return{data: {videoElement, stream, capabilities}};
}

export async function stop(videoElement: HTMLVideoElement, stream: MediaStream) {

    if(videoElement.src !== undefined){
        videoElement.src = '';
    }

	if(videoElement.srcObject !== null){
        videoElement.srcObject = null;  
    }
	

    stream.getTracks().forEach(track => 
        {
            stream.removeTrack(track);
            track.stop();
        });
}