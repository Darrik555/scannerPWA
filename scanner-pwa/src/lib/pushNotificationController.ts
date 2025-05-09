function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

async function saveSubscription(subscription: PushSubscription) {
    const API_PATH = "/api/subscription";
    const response = await fetch(API_PATH, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription)
    });
    return response.json();
} 

export async function requestNotificationPermission() {

    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!');
      }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!');
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }

    try{
        const registration = await navigator.serviceWorker.ready;
        const applicationServerKey = urlB64ToUint8Array(
            "BIuD3JFVLjCFT3WDZ3fbh7bCW-XFaNCa7woQVp8Q6rfPBoIE6JVxW2U7fkUJGMfJe8EFUlF4AuQwL63N5eJzIr8"
        );
        const options = {applicationServerKey: applicationServerKey, userVisibleOnly: true};
        const subscription = await registration.pushManager.subscribe(options);
        saveSubscription(subscription);
    }catch(e){
        console.error("Push Registration failed");
    }
}
