import { useServerContext } from "../hooks/useServerContext.js";
import styles from "./styles/chat.module.css";
export interface ChatMessageProps {
    sender: string,
    message: string,
    timestamp: string
}

export default function ChatMessage({sender, message, timestamp}: ChatMessageProps){
    if(sender == null)
        sender = '';
    const {nickname} = useServerContext();
    const messageRightPosition = nickname === sender ? true : false;
    return (<div className={`${styles.message} ${messageRightPosition ? styles.right : styles.left}`}>
        <div className={styles.sender}>{sender}</div>
        <div className={styles.text}>{message}</div>
        <div className={styles.timestamp}>{new Date(timestamp).toDateString()}</div>
    </div>)
}