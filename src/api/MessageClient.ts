import type MessageData from "@/models/MessageData";
import { apiBasis } from "./ApiBasis";

export function newThread(): Promise<MessageData> {
    return apiBasis.post("/newThread").then((response) => {
        return response.data as MessageData
    })
}

export function newMessage(messageData: MessageData): Promise<MessageData> {
    return apiBasis.post("/newMessage", messageData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.data as MessageData
    })
}