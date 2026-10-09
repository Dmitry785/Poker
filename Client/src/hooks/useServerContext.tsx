import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import type {ChatMessageData} from "../data/ChatMessageData.js";
import type SendData from "../requests/SendRequest.js";


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
        if(hubConnectionPromiseRef.current){
            return await hubConnectionPromiseRef.current;
        }
        if(hubConnectionRef.current && hubConnectionRef.current.baseUrl == hubURL.href && (
            hubConnectionRef.current.state == HubConnectionState.Connected ||
            hubConnectionRef.current.state == HubConnectionState.Connecting ||
            hubConnectionRef.current.state == HubConnectionState.Reconnecting))
        {
            console.log("3 "+hubConnectionRef.current.state)
            return hubConnectionRef.current;
        }
        hubConnectionPromiseRef.current = (async () =>{
            if(hubConnectionRef.current){
                await hubConnectionRef.current.stop();
            }
            hubConnectionRef.current = new HubConnectionBuilder()
                .withUrl(hubURL.href)
                .withAutomaticReconnect([1000])
                .configureLogging(LogLevel.Information)
                .build() as HubConnection & {
                    send<T extends keyof HubClientMethods>(methodName: T, ...args: Parameters<HubClientMethods[T]>): Promise<void>
                }
            setHubConnection(hubConnectionRef.current);
            try{
                await hubConnectionRef.current.start();
                return hubConnectionRef.current;
            }
            catch(err){
                hubConnectionRef.current.stop();
                hubConnectionRef.current = null;
                setHubConnection(null);
                throw err;
            }
            finally{
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

