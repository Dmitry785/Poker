import React, { use, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useServerContext } from "../../hooks/useServerContext.js";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function ConnectionWindow()  {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {serverUrl, setServerUrl, setHubConnection} = useServerContext();
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        const sleep = new Promise((resolver)=>setTimeout(resolver, 1000));
        try{
            const hubURL = new URL("chat", serverUrl);
            const hubConnection = new HubConnectionBuilder()
                .withUrl(hubURL.href)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .withServerTimeout(500)
                .build();
            setHubConnection(hubConnection);
            await Promise.all([hubConnection.start(), sleep]);
            navigate("/authentication");
        } catch(err: any){
            alert(err)
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
        navigate('/authentication');
    }
    return (<div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.connect_form}>
            <label htmlFor="server_url">Адрес сервера</label>
            <input id="server_url" value={serverUrl} onInput={(e)=>setServerUrl((e.target as HTMLInputElement).value)}/>
            <button type="submit">Подключиться</button>
        </form>
        {isLoading && <span>Loading...</span>}
        {errorMessage != '' && <span>Error: {errorMessage}</span>}
    </div>)
}