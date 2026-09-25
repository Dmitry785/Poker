import styles from "./styles/chat.module.css";
import ChatMessage, { type ChatMessageProps } from "./ChatMessage.js"
import { useEffect, useState } from "react";
import { useServerContext } from "../hooks/useServerContext.js";
import { Link } from "react-router";

export default function GameChat(){
    const [draftMessage, setDraftMessage] = useState('');
    const {hubConnection, selfIdRef, messages} = useServerContext();
    const onSendMessage = (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(draftMessage == ''){
            return;
        }
        hubConnection!.send("Send", {Id: selfIdRef.current, Message: draftMessage});
        setDraftMessage('');
    }
    return (<div className={styles.container}>
        <Link to="/game">Вернуться к столу</Link>
        <div className={styles.list}>
            {messages.map((message, index)=>(<ChatMessage key={index} {...message}></ChatMessage>))}
        </div>
        <form className={styles.panel} onSubmit={onSendMessage}>
            <input placeholder="Введите сообщение" value={draftMessage} onInput={(e)=>{setDraftMessage((e.target as HTMLInputElement).value)}}></input>
            <button>Отправить</button>
        </form>
    </div>)
}