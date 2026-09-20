import { useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import useSignalR from '../../hooks/useSignalR.js';
import styles from "./styles.module.css";


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const {serverUrl} = useServerContext();
  const [chatMessages, hubConnection] = useSignalR(serverUrl);
  return (
    <div>
      {serverUrl}
    </div>
  )
}
