import React, { use, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate, type NavigateFunction } from "react-router";
import { useServerContext } from "../../hooks/useServerContext.js";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import loading_svg from "../../assets/loading.svg";
import type SendData from "../../requests/SendRequest.js";
import Form from "../../components/Form.js";


export default function ConnectionWindow()  {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {serverUrl, setServerUrl, storeServerUrl, hubConnection, connect} = useServerContext();
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        storeServerUrl(serverUrl);
        setErrorMessage('');
        setIsLoading(true);
        await connect()
            .then((hubConnection)=>{
                navigate("/authentication");
            }).catch((err: Error)=>{
                setErrorMessage(err.message)
            }).finally(()=>setIsLoading(false));
    }
    return (<div className={styles.container}>
        <Form buttonText="Подключиться" 
            header="Подключение"
            className={styles.connection_form}
            onFormSubmit={onSubmit}>
                <p>
                    <label htmlFor="server_url">Адрес сервера</label>
                    <input id="server_url" value={serverUrl} 
                        onChange={(e)=>
                            setServerUrl((e.target as HTMLInputElement).value)
                        }></input>
                </p>
                
            </Form>
        {isLoading && <div className={styles.loading}><img src={loading_svg} alt="Loading..."></img></div>}
        {errorMessage != '' && <div className={styles.error}>{errorMessage}</div>}
    </div>)
}