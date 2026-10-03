import { HubConnection } from "@microsoft/signalr";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type {ChatMessageData} from "../data/ChatMessageData.js";


interface ServerContextType {
    serverUrl: string;
    setServerUrl: React.Dispatch<React.SetStateAction<string>>;
    storeServerUrl: (url: string) => void;
    hubConnection: HubConnection | undefined;
    setHubConnection: React.Dispatch<React.SetStateAction<HubConnection | undefined>>;
    selfIdRef: React.RefObject<string | undefined>;
    nickname: string;
    setNickname: React.Dispatch<React.SetStateAction<string>>;
    messages: ChatMessageData[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

const defaultServerUrl = "http://10.0.0.159:5057";

export const ServerContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [hubConnection, setHubConnection] = useState<HubConnection | undefined>(undefined);
    const [nickname, setNickname] = useState('');
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [serverUrl, setServerUrl] = useState(localStorage.getItem("server_url") || defaultServerUrl);
    const storeServerUrl = useCallback((url: string) => {
        localStorage.setItem("server_url", url);
    }, []);
    const selfIdRef = useRef<string | undefined>(localStorage.getItem("selfId") || undefined);
    const context = {hubConnection, setHubConnection, 
        serverUrl, setServerUrl, storeServerUrl, selfIdRef,
         nickname, setNickname, messages, setMessages};
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

