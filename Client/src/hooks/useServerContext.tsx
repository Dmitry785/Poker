import React, { createContext, useContext, useState } from "react";

interface ServerContextType {
    serverUrl: string;
    setServerUrl: (url: string) => void;
    storeServerUrl: (url: string) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

const defaultServerUrl = "10.0.0.159:5057";

export const ServerContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [serverUrl, setServerUrl] = useState(loca defaultServerUrl);
    const storeServerUrl = (url: string) => {
        localStorage.setItem("server_url", url);
    }

    return (
        <ServerContext.Provider value={{serverUrl, setServerUrl, storeServerUrl}}>
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

