import type { RequestHandler } from "../token/$types";
import type { PushSubscription } from "web-push";

const subscriptions: PushSubscription[] = [];

export const POST: RequestHandler = async({request}) => {
    try{
        const subscription = await request.json();
        console.log("received subscription"+ subscription + process.env.PRIVATE_VAPID_KEY);
        subscription.push(subscription);
        return new Response('Subscription saved');
    }catch(e){
        console.error("Subscription error: ", e);
        return new Response("Server error");
    }
}

export function _getAllSubscriptions(){
    return subscriptions;
}