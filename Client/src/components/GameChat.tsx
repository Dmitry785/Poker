import styles from "./styles/chat.module.css";
import ChatMessage from "./ChatMessage.js"
import { useState } from "react";
import { useServerContext } from "../hooks/useServerContext.js";
import { Link } from "react-router";
import axios from "axios";
import type SendData from "../requests/SendRequest.js";

export default function GameChat(){
    const [backgroundUrl, setBackgroundUrl] = useState("1");
    const [draftMessage, setDraftMessage] = useState('');
    const {serverUrl, selfIdRef, messages} = useServerContext();
    const onSendMessage = (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(draftMessage == ''){
            return;
        }
        const url = new URL("/send/text", serverUrl);
        //hubConnection!.send("Send", {Id: selfIdRef.current, Message: draftMessage});
        const sendData: SendData = {id: selfIdRef.current!, text: draftMessage}
        axios.post(url.href, sendData)
        .catch(err=>alert(err));
        setDraftMessage('');
    }
    return (<div className={styles.container}>
        <div className={styles.background_selector}>
            <button onClick={()=>setBackgroundUrl(`1`)}>Грибочки</button>
            <button onClick={()=>setBackgroundUrl(`2`)}>Котики</button>
            <button onClick={()=>setBackgroundUrl(`3`)}>Кирпич</button>
        </div>
        {true ? (<div className={styles.list} style={{backgroundImage: `url(${new URL(`chat_background_${backgroundUrl}.jpg`, window.location.origin).href})`}}>
            {messages.map((message, index)=>(<ChatMessage key={index} {...message}></ChatMessage>))}
        </div>) : (<div className={styles.list} style={{backgroundImage: `url(https://pic.rtbcdn.ru/video/36/67/3667e12ba51cf418315c36018bed8f40.jpg)`}}>
            {messages.map((message, index)=>(<ChatMessage key={index} {...message}></ChatMessage>))}
        </div>)}
        <form className={styles.panel} onSubmit={onSendMessage}>
            <input placeholder="Введите сообщение" value={draftMessage} onInput={(e)=>{setDraftMessage((e.target as HTMLInputElement).value)}}></input>
            <button>Отправить</button>
        </form>
    </div>)
}