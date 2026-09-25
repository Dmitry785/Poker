import React, { use, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate, type NavigateFunction } from "react-router";
import { useServerContext } from "../../hooks/useServerContext.js";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import loading_svg from "../../assets/loading.svg";
import type SendData from "../../requests/SendRequest.js";

interface HubClientMethods {
    Send: (data: SendData) => void;
}

const hubConnection = new HubConnectionBuilder()
    .withUrl("...")
    .build() as HubConnection & {
        send<K extends keyof HubClientMethods>(methodName: K, ...args: Parameters<HubClientMethods[K]>): Promise<void>;
    };
export default function ConnectionWindow()  {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {serverUrl, setServerUrl, storeServerUrl, hubConnection, setHubConnection} = useServerContext();
    useEffect(()=>{
        if (!hubConnection || hubConnection.state !== "Connected")
            return;
        hubConnection.stop();
    }, [])
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        storeServerUrl(serverUrl);
        setErrorMessage('');
        setIsLoading(true);
        await TryConnect(serverUrl, 2000, navigate)
            .then((hubConnection)=>{
                setHubConnection(hubConnection);
                navigate("/authentication");
            }).catch((err: Error)=>{
                setErrorMessage(err.message)
            }).finally(()=>setIsLoading(false));
    }
    return (<div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.connect_form}>
            <label htmlFor="server_url">Адрес сервера</label>
            <input id="server_url" value={serverUrl} onInput={(e)=>setServerUrl((e.target as HTMLInputElement).value)}/>
            <button type="submit">Подключиться</button>
        </form>
        {isLoading && <div className={styles.loading}><img src={loading_svg} alt="Loading..."></img></div>}
        {errorMessage != '' && <div className={styles.error}>Error: {errorMessage}</div>}
    </div>)
}

async function TryConnect(url: string, timeout: number, navigate: NavigateFunction): Promise<HubConnection>{
    const sleep = new Promise((resolver)=>setTimeout(resolver, timeout));
    const hubURL = new URL("chat", url);
    const hubConnection = new HubConnectionBuilder()
        .withUrl(hubURL.href)
        .withAutomaticReconnect([1000])
        .configureLogging(LogLevel.Information)
        .build() as HubConnection & {
            send<T extends keyof HubClientMethods>(methodName: T, ...args: Parameters<HubClientMethods[T]>): Promise<void>
        };
    hubConnection.onclose(()=>{
      navigate("/connect");
    })
    await Promise.any([hubConnection.start(), sleep]);
    if (hubConnection.state !== "Connected")
        throw new Error("Timeout exception");
    return hubConnection;
}