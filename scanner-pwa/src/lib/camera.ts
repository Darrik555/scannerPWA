export async function start(videoElement: HTMLVideoElement){
    const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { facingMode: 'environment'}
	});

    
    videoElement.srcObject = stream;
    

    videoElement.play();

    const [track] = stream.getVideoTracks();
	const capabilities: Partial<MediaTrackCapabilities> = track?.getCapabilities?.() ?? {};

    return{data: {videoElement, stream, capabilities}};
}