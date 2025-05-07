
let stream: MediaStream | null = null;
let videoTrack: MediaStreamTrack | null = null;

export async function start(videoElement: HTMLVideoElement){

    const preferredDeviceId = await getPreferredEnvironmentCameraId();

    //if(!preferredDeviceId){
    //    throw new Error("No preferred device found")
    //}

    // frameRate? frameRate: { ideal: 24, max: 30 }
    const constraints = {
        audio: false,
        video: { 
            deviceId: { ideal: preferredDeviceId},
            width: 1280, 
            height: 720, 
            facingMode: 'environment',
        }
    };

    try{
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoTrack = stream.getVideoTracks()[0];

        videoElement.srcObject = stream;
    
        await videoElement.play();
    
        await waitForVideoReady(videoElement);

        return{data: {videoElement, stream}};
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

async function getPreferredEnvironmentCameraId(){
    await navigator.mediaDevices.getUserMedia();
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const possibleBackCameraLabelKeywords = ["0","back","rear","main","environment"];
    const notPreferredCameraLabelKeywords = ["wide","ultra"];

    // filters for cameras on the back of the device
    const filterdVideoDevices = devices.filter((device) => 
        device.kind === "videoinput" && 
        possibleBackCameraLabelKeywords.some((keyword) => 
            device.label.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    
    // filters for not wide angle cameras
    const preferred = filterdVideoDevices.find((device) => !notPreferredCameraLabelKeywords.some((keyword) => 
        device.label.toLowerCase().includes(keyword)
    ));

    return (preferred ?? filterdVideoDevices[0]).deviceId ?? null;
}

export async function toggleTorch(isTorchOn: boolean) {
    
    const capabilities: Partial<MediaTrackCapabilities> = videoTrack?.getCapabilities?.() ?? {};

    // @ts-expect-error
    if(capabilities && capabilities.torch){
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