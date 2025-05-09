import type { RequestHandler } from "../token/$types";
import type { PushSubscription } from "web-push";

const subscriptions: PushSubscription[] = [];

export const POST: RequestHandler = async({request}) => {
    const subscription = await request.json();
    subscription.push(subscription);
    return new Response('Subscription saved');
}

export function getAllSubscriptions(){
    return subscriptions;
}