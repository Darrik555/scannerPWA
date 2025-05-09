import type { RequestHandler } from "../token/$types";
import type { PushSubscription } from "web-push";

const subscriptions: PushSubscription[] = [];

export const POST: RequestHandler = async({request}) => {
    try{
        const subscription = await request.json();
        subscriptions.push(subscription);
        return new Response(JSON.stringify({success: true}));
    }catch(e){
        console.error("Subscription error: ", e);
        return new Response(JSON.stringify({error: 'Server error'}));
    }
}

export function _getAllSubscriptions(){
    return subscriptions;
}