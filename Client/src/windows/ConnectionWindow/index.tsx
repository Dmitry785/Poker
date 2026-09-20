import React, { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";

const defaultServerUrl = "10.0.0.159:5057";

export default function ConnectionWindow()  {
    const connect = useNavigate();
    const [serverUrl, setServerUrl] = useState(defaultServerUrl);

    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        connect('/authentication');
    }
    return (<div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.connect_form}>
            <label htmlFor="server_url">Адрес сервера</label>
            <input id="server_url" value={serverUrl} onInput={(e)=>setServerUrl((e.target as HTMLInputElement).value)}/>
            <button type="submit">Подключиться</button>
        </form>
    </div>)
}