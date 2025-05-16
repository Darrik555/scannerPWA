export async function getGeolocationPermission(){
    try{
        if(!navigator.permissions){
            console.warn('Permission API not supported');
            return 'granted';
        }

        const status = await navigator.permissions.query({name: 'geolocation'});

        if (status.state === 'granted'){
            return 'granted';
        }else if(status.state === 'prompt'){
            return new Promise<PermissionState>((resolve,reject) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve('granted'),
                    (err) => {
                        console.warn('Geolocation Permission denied', err);
                        resolve('denied');
                    }
                );
            });
        }else{
            return 'denied';
        }
    }catch(err){
        console.error('Error in permission query', err);
        throw new Error('Permission could not be checked');
    }
}


export async function watchPosition(onUpdate:(coords: [number, number]) => void): Promise<number> {
    const permission = await getGeolocationPermission();
    if(permission !== 'granted'){
        throw new Error('Geolocation permission not granted');
    }

    return navigator.geolocation.watchPosition(position => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        onUpdate(coords);
    }, 
        err => console.error('Geolocation Error', err),
        {enableHighAccuracy: true, maximumAge: 0, timeout: 10000}
    );
}