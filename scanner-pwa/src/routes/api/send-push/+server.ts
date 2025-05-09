import type { RequestHandler } from "../token/$types";
import webPush from 'web-push';
import { _getAllSubscriptions } from "../subscription/+server";

const private_key = process.env.PRIVATE_VAPID_KEY ?? "";

webPush.setVapidDetails(
    'mailto:example@email.com',
    'BIuD3JFVLjCFT3WDZ3fbh7bCW-XFaNCa7woQVp8Q6rfPBoIE6JVxW2U7fkUJGMfJe8EFUlF4AuQwL63N5eJzIr8',
    private_key
);

export const POST: RequestHandler = async({request}) => {
    const {title, message} = await request.json();

    const subs = _getAllSubscriptions();
    const sendAll = subs.map((sub) => 
        webPush.sendNotification(sub, JSON.stringify({
            title: title || 'Titel',
            body: message || 'Message Content'
        }))
    .catch((e) => {
        console.error("Push-Error", e)
    }));

    await Promise.all(sendAll);

    return new Response('Push send');
}