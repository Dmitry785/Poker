import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import styles from "./styles.module.css";
import { useNavigate } from 'react-router';
import axios from 'axios';
import Form from '../../components/Form.js';


export default function AuthenticationWindow() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoinAsSpectator, setIsJoinAsSpectator] = useState(false);
  const {serverUrl, hubConnection, selfIdRef, nickname, setNickname} = useServerContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!hubConnection || hubConnection.state !== "Connected"){
      navigate("/connect", {replace: true});
    }
  }, [hubConnection, navigate]);
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
        <Form buttonText="Подключиться" 
            header="Регистрация"
            onFormSubmit={onSubmit} 
            inputs={[{
              label: "Имя", 
              input: {
                  setValue: (e)=>setNickname((e.target as HTMLInputElement).value), 
                  value: nickname
              }},{
              label: "Войти как спектатор", 
              input: {
                  setValue: (e)=>setIsJoinAsSpectator((e.target as HTMLInputElement).checked), 
                  value: isJoinAsSpectator
              }}]}/>
        {errorMessage != '' && <div className={styles.error}>Error: {errorMessage}</div>}
    </div>)
}
