import { HubConnection } from "@microsoft/signalr";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface ServerContextType {
    serverUrl: string;
    setServerUrl: (url: string) => void;
    storeServerUrl: (url: string) => void;
    hubConnection: HubConnection | undefined;
    setHubConnection: (connection: HubConnection | undefined) => void;
    selfIdRef: React.RefObject<string | undefined>
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

const defaultServerUrl = "http://10.0.0.159:5057";

export const ServerContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [hubConnection, setHubConnection] = useState<HubConnection | undefined>(undefined);
    const [serverUrl, setServerUrl] = useState(localStorage.getItem("server_url") || defaultServerUrl);
    const storeServerUrl = useCallback((url: string) => {
        localStorage.setItem("server_url", url);
    }, []);
    const selfIdRef = useRef<string | undefined>(localStorage.getItem("selfId") || undefined);
    const context = useMemo(()=>({hubConnection, setHubConnection, 
        serverUrl, setServerUrl, storeServerUrl, selfIdRef}), [serverUrl, hubConnection]);
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

