
let stream: MediaStream | null = null;
let videoTrack: MediaStreamTrack | null = null;
    


export async function start(videoElement: HTMLVideoElement){
    try{
        const preferredCameraDeviceId = await getPreferredEnvironmentCameraId();

        // frameRate? frameRate: { ideal: 24, max: 30 }
        const constraints = {
            audio: false,
            video: { 
                deviceId: {exact: preferredCameraDeviceId},
                width: 1280, 
                height: 720, 
                facingMode: 'environment',
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoTrack = stream.getVideoTracks()[0];

        videoElement.srcObject = stream;
    
        await videoElement.play();
    
        await waitForVideoReady(videoElement);

        return stream;
    }catch(e){
        if(stream){
            stop(videoElement, stream);
        }
        throw new Error("Camera could not be started: " + e);
    }
}

function waitForVideoReady(video: HTMLVideoElement){
    return new Promise<void>((resolve) => {
        if(video.readyState >= 2){
            resolve();
        }else{
            video.onloadeddata = () => resolve();
        }
    });
}

// When multipe cameras are connected, try to pick the one that has a torch functionality 
async function getPreferredEnvironmentCameraId(){
    try{   
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const possibleBackCameraLabelKeywords = ["0","back","rear","main","environment"];
        const notPreferredCameraLabelKeywords = ["wide","ultra"];
    
        // filters for camera with '0' in label, which seems to be the rear camera with torch capability
        return devices.reverse().find((device) => device.label.includes("0"))?.deviceId;
    }catch(err){
        console.error("Preferred Camera could not be identified: " + err);
    }
}

export function hasTorchCapability(){
    const capabilities: Partial<MediaTrackCapabilities> = videoTrack?.getCapabilities?.() ?? {};
    // @ts-expect-error
    return (capabilities && capabilities.torch);
}

export async function toggleTorch(isTorchOn: boolean) {
    if(hasTorchCapability()){
        try{
            // @ts-expect-error
            await videoTrack.applyConstraints({advanced: [{torch: isTorchOn}]});
        }catch(e){
            console.warn("Torch state could not be changed");
        }
    }else{
        console.warn("Torch is not supported on this device");
    }
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