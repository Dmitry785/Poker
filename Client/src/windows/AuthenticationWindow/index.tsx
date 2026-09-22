import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import useSignalR from '../../hooks/useSignalR.js';
import styles from "./styles.module.css";
import { useNavigate } from 'react-router';


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const {serverUrl} = useServerContext();
  const returnToPreviousPage = useNavigate();
  const onConnectionClose = ()=>{
    console.log("on auth page: return");
    returnToPreviousPage('/connect');
  }
  console.log("on auth page");
  const [chatMessages, hubConnection] = useSignalR(serverUrl, onConnectionClose);
  return (
    <div>
      {serverUrl}
    </div>
  )
}
