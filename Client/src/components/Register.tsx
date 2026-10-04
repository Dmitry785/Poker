import Form from "./Form.js";
import styles from "./styles/authentication.module.css";
import { useServerContext } from "../hooks/useServerContext.js";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";


export default function Register(){
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isJoinAsSpectator, setIsJoinAsSpectator] = useState(false);
    const {serverUrl, selfIdRef, nickname, setNickname} = useServerContext();
    const navigate = useNavigate();
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        try{  
            const result = await TryRegister(serverUrl,
                 nickname, password, isJoinAsSpectator);
            selfIdRef.current = result;
            localStorage.setItem("selfId", result);
            navigate("/game");
        }
        catch(err){
            if (axios.isAxiosError(err) && err.response?.data){
            setErrorMessage(err.response.data);
            }
            else if(err instanceof Error &&  err.message)
            setErrorMessage(err.message);
        }
    }
    return (<div className={styles.container}>
    <Link to="/authentication">Вход</Link>
    <Form buttonText="Зарегистрироваться" 
        header="Регистрация"
        className={styles.form}
        onFormSubmit={onSubmit}>
            <p>
                <label htmlFor="nickname">Имя</label>
                <input id="nickname" value={nickname} onInput={(e)=>setNickname((e.target as HTMLInputElement).value)}/>
            </p>
            <p>
                <label htmlFor="password">Пароль</label>
                <input id="password" value={password} onInput={(e)=>setPassword((e.target as HTMLInputElement).value)}/>
            </p>
            <p className={styles.isSpectatorContainer}>
                <input id="isSpectator" type="checkbox" checked={isJoinAsSpectator} onChange={()=>setIsJoinAsSpectator(!isJoinAsSpectator)}></input>
                <label htmlFor='isSpectator'>Подключиться как спектатор</label>
            </p>
        </Form>
        {errorMessage != '' && <div className={styles.error}>Error: {errorMessage}</div>}
    </div>);
}
async function TryRegister(serverUrl: string, nickname: string, password: string, isSpec: boolean): Promise<string>{
    const serverRegistrationEndpoint = new URL("/register", serverUrl);
    serverRegistrationEndpoint.searchParams.append("nickname", nickname);
    serverRegistrationEndpoint.searchParams.append("password", password);
    serverRegistrationEndpoint.searchParams.append("isSpectator", isSpec ? "1":"0");
    const response = await axios.get(serverRegistrationEndpoint.href);
    if(!response.data)
        throw new Error("Response has no data");
    return response.data;
}