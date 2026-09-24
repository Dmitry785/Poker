import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import useSignalR from '../../hooks/useSignalR.js';
import styles from "./styles.module.css";
import { useNavigate } from 'react-router';
import { HubConnection } from '@microsoft/signalr';


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const {serverUrl, hubConnection} = useServerContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!hubConnection || hubConnection.state !== "Connected"){
      navigate("/connect", {replace: true});
      return;
    }
    hubConnection.on('Receive', (sender: string, message: string)=>{
        console.log(`${message} >> ${sender}`);
    });
    hubConnection.on('Connected', (ip: string)=>{
        console.log(`player ${ip} connected`);
    });
    hubConnection.onclose(()=>{
      navigate("/connect");
    })
    return ()=>{
      hubConnection.off("Receive");
      hubConnection.off("Connected");
    }
  }, [hubConnection])
  if(!hubConnection) return null;
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(nickname);
  }
  return (
    <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.registration_form}>
            <label htmlFor="nickname">Имя</label>
            <input id="nickname" value={nickname} onInput={(e)=>setNickname((e.target as HTMLInputElement).value)}/>
            <button type="submit">Вотйи в игру</button>
        </form>
    </div>)
}
