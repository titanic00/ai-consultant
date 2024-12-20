export default interface MessageData {
    message: {
        additional: {},
        content: string,
        type: string
    },
    threadId: string,
    sender: string
}