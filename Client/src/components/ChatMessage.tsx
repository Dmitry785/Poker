import { useServerContext } from "../hooks/useServerContext.js";
import styles from "./styles/chat.module.css";
import type {ChatMessageData} from "../data/ChatMessageData.js"

export default function ChatMessage({sender, text, timestamp, fileType, fileUrl}: ChatMessageData){
    if(sender == null)
        sender = '';
    const {nickname} = useServerContext();
    const messageRightPosition = nickname === sender ? true : false;
    return (<div className={`${styles.message} ${messageRightPosition ? styles.right : styles.left}`}>
        <div className={styles.sender}>{sender}</div>
        <div className={styles.text}>{text}</div>
        <div className={styles.timestamp}>{new Date(timestamp).toDateString()}</div>
    </div>)
}