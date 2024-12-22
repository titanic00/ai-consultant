export default interface MessageData {
    id?: number,
    message: {
        additional: {},
        content: string,
        type: string
    },
    threadId: string,
    sender?: string
}