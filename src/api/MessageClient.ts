import type MessageData from "@/models/MessageData";
import { apiBasis, apiBasisAuth, apiBasisStorage } from "./ApiBasis";

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

export function downloadImg(accessToken: string, bucketName: string, fileName: string): Promise<Blob> {
    return apiBasisStorage.get(`/${bucketName}/o/${encodeURIComponent(fileName)}?alt=media`, {
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then((response) => {
        return response.data as Blob
    })
}