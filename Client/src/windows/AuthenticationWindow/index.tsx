import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import styles from "./styles.module.css";
import { useNavigate } from 'react-router';
import axios from 'axios';


export default function AuthenticationWindow() {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoinAsSpectator, setIsJoinAsSpectator] = useState(false);
  const {serverUrl, hubConnection, selfIdRef} = useServerContext();
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
  }, [hubConnection, navigate])
  if(!hubConnection) return null;
  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try{  
      const serverRegistrationEndpoint = new URL("/reg", serverUrl);
      serverRegistrationEndpoint.searchParams.append("nickname", nickname);
      serverRegistrationEndpoint.searchParams.append("isSpectator", isJoinAsSpectator ? "1":"0");
      const response = await axios.get(serverRegistrationEndpoint.href);
      if(!response.data)
        throw new Error("Response has no data");
      alert(response.data);
      selfIdRef.current = response.data;
      localStorage.setItem("selfId", response.data);
      navigate("/game");
    }
    catch(err){
      if (axios.isAxiosError(err) && err.response?.data){
        setErrorMessage(err.response.data);
      }
      else if(err instanceof Error && err.message)
        setErrorMessage(err.message);
    }
  }
  return (
    <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.registration_form}>
            <label htmlFor="nickname">Имя</label>
            <input id="nickname" value={nickname} onInput={(e)=>setNickname((e.target as HTMLInputElement).value)}/>
            <p className={styles.isSpectatorContainer}>
              <input id="isSpectator" type="checkbox" checked={isJoinAsSpectator} onChange={()=>setIsJoinAsSpectator(!isJoinAsSpectator)}></input>
              <label htmlFor='isSpectator'>Подключиться как спектатор</label>
            </p>
            <button type="submit">Вотйи в игру</button>
        </form>
        {errorMessage != '' && <div className={styles.error}>Error: {errorMessage}</div>}
    </div>)
}
