import Form from "./Form.js";
import styles from "./styles/authentication.module.css";
import { useServerContext } from "../hooks/useServerContext.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";


export default function Login(){
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hasNicknameError, setHasNicknameError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const {serverUrl, selfIdRef, nickname, setNickname} = useServerContext();
    const navigate = useNavigate();
    
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        if(nickname == ''){
            setHasNicknameError(true);
            setErrorMessage("Введите имя");
            return;
        }
        setHasNicknameError(false);
        if(password == ''){
            setHasPasswordError(true);
            setErrorMessage("Введите пароль");
            return;
        }
        setHasPasswordError(false);
        try{  
            const result = await TryLogin(serverUrl, nickname, password);
            selfIdRef.current = result;
            localStorage.setItem("selfId", result);
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
    return (<div className={styles.container}>
    <Form buttonText="Войти" 
        header="Вход"
        className={styles.form}
        onFormSubmit={onSubmit}>
            <p>
                <label htmlFor="nickname">Имя</label>
                <input className={hasNicknameError ? styles.input_error : ""} id="nickname" value={nickname} onInput={(e)=>setNickname((e.target as HTMLInputElement).value)}/>
            </p>
            <p>
                <label htmlFor="password">Пароль</label>
                <input className={hasPasswordError ? styles.input_error : ""} id="password" value={password} onInput={(e)=>setPassword((e.target as HTMLInputElement).value)}/>
            </p>
        </Form>
        {errorMessage != '' && <div className={styles.error}>Error: {errorMessage}</div>}
        <Link to="/authentication/register">Регстрация</Link>
    </div>
    );
}
async function TryLogin(serverUrl: string, nickname: string, password: string): Promise<string>{
    const serverRegistrationEndpoint = new URL("/login", serverUrl);
    serverRegistrationEndpoint.searchParams.append("nickname", nickname);
    serverRegistrationEndpoint.searchParams.append("password", password);
    const response = await axios.get(serverRegistrationEndpoint.href);
    if(!response.data)
        throw new Error("Response has no data");
    return response.data;
}