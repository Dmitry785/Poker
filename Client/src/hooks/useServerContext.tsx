import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type {ChatMessageData} from "../data/ChatMessageData.js";
import type SendData from "../requests/SendRequest.js";
import { useNavigate } from "react-router";


interface ServerContextType {
    hubConnection: HubConnection | null,
    connect: (timeout?: number) => Promise<HubConnection>
    serverUrl: string;
    setServerUrl: React.Dispatch<React.SetStateAction<string>>;
    storeServerUrl: (url: string) => void;
    selfIdRef: React.RefObject<string | null>;
    nickname: string;
    setNickname: React.Dispatch<React.SetStateAction<string>>;
    messages: ChatMessageData[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>;
}

const ServerContext = createContext<ServerContextType | null>(null);

const defaultServerUrl = "http://localhost:5138";
const defaultTimeout = 2000;

interface HubClientMethods {
    Send: (data: SendData) => void;
}

export const ServerContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
    const [nickname, setNickname] = useState('');
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [serverUrl, setServerUrl] = useState(localStorage.getItem("server_url") || defaultServerUrl);
    const storeServerUrl = useCallback((url: string) => {
        localStorage.setItem("server_url", url);
    }, []);
    const selfIdRef = useRef<string | null>(localStorage.getItem("selfId") || null);
    const hubConnectionRef = useRef<HubConnection | null>(null);
    const hubConnectionPromiseRef = useRef<Promise<HubConnection> | null>(null);
    const connect = useCallback(async (timeout = defaultTimeout): Promise<HubConnection> =>{
        const hubURL = new URL("chat", serverUrl);
        if(hubConnectionRef.current && hubConnectionRef.current.baseUrl == hubURL.href && (
            hubConnectionRef.current.state == HubConnectionState.Connected ||
            hubConnectionRef.current.state == HubConnectionState.Connecting ||
            hubConnectionRef.current.state == HubConnectionState.Reconnecting))
        {
            return hubConnectionRef.current;
        }
        if(hubConnectionPromiseRef.current)
            return hubConnectionPromiseRef.current;
        hubConnectionPromiseRef.current = (async () =>{
            if(hubConnectionRef.current)
                await hubConnectionRef.current.stop();
            hubConnectionRef.current = new HubConnectionBuilder()
                .withUrl(hubURL.href)
                .withAutomaticReconnect([1000])
                .configureLogging(LogLevel.Information)
                .build() as HubConnection & {
                    send<T extends keyof HubClientMethods>(methodName: T, ...args: Parameters<HubClientMethods[T]>): Promise<void>
                }
            setHubConnection(hubConnectionRef.current);
            let timeoutId: number | null = null;
            const sleep = new Promise((resolve)=>{
                timeoutId = setTimeout(resolve, timeout);
            });
            try{
                await Promise.race([hubConnectionRef.current.start(), sleep]);
                if (hubConnectionRef.current.state !== HubConnectionState.Connected)
                    throw new Error("Время подключения вышло");
                return hubConnectionRef.current;
            }
            catch(err){
                hubConnectionRef.current.stop().catch(err => console.error("Ошибка при остановке hubConnection"));
                hubConnectionRef.current = null;
                setHubConnection(null);
                throw err;
            }
            finally{
                if(timeoutId)
                    clearTimeout(timeoutId);
                hubConnectionPromiseRef.current = null;
            }
        })();
        return hubConnectionPromiseRef.current;
    }, [serverUrl])
    const context = {serverUrl, setServerUrl, storeServerUrl, selfIdRef,
         nickname, setNickname, messages, setMessages, hubConnection, connect};
    return (
        <ServerContext.Provider value={context}>
            {children}
        </ServerContext.Provider>
    )
}

export function useServerContext(){
    const context = useContext(ServerContext);
    if (!context){
        throw new Error("Unable to use ServerContext");
    }
    return context;
}

