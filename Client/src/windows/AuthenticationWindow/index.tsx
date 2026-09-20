import { useRef, useState } from 'react';
import useSignalR from '../../hooks/useSignalR.js';
import styles from "./styles.module.css";


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const [chatMessages, hubConnection] = useSignalR()
  return (
    <div>
      
    </div>
  )
}
