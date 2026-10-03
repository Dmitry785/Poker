export interface ChatMessageData{
    sender: string,
    text: string,
    fileUrl: string | undefined,
    fileType: string | undefined,
    timestamp: string
}