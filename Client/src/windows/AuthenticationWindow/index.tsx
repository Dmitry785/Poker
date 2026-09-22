import { useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import useSignalR from '../../hooks/useSignalR.js';
import styles from "./styles.module.css";
import { useNavigate } from 'react-router';


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const {serverUrl} = useServerContext();
  const returnToPreviousPage = useNavigate();
  const [chatMessages, hubConnection] = useSignalR(serverUrl);
  if (hubConnection)
    hubConnection.onclose((err) => {
      returnToPreviousPage('/connect');
    });
  return (
    <div>
      {serverUrl}
    </div>
  )
}
