
let stream: MediaStream | null;

export async function start(videoElement: HTMLVideoElement){
    // frameRate? frameRate: { ideal: 24, max: 30 }
    const constraints = {
        audio: false,
        video: { width: 1280, height: 720, facingMode: 'environment' }
      };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    videoElement.srcObject = stream;
    videoElement.addEventListener('canplay',()=>{
        videoElement.play();
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