export default interface MessageData<T = Record<string, any>> {
    id?: number,
    message: {
        additional: T,
        content: string,
        type: string
    },
    threadId: string,
    sender?: string
}