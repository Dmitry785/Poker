import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ChatMessage{
    message: string,
    sender: string
}

export default function useSignalR(connectionUrl: string): [ChatMessage[], HubConnection] {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connection, setConnection] = useState<null | HubConnection>(null);

    useEffect(() => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(connectionUrl)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        setConnection(hubConnection);
        return ()=>{
            hubConnection.stop();
        }
    }, [connectionUrl])

    useEffect(()=>{
        if(!connection)
            return;
        connection.start()
        .then(()=>{
            connection.on('Receive', (sender: string, message: string)=>{
                console.log(`${message} >> ${sender}`);
                setMessages(prev=>[...prev, {sender: sender, message: message}]);
            });
        })
        .catch(()=>console.log('unable to connect'))
        return ()=>{
            connection.off('Receive');
            connection.stop();
        }
    }, [connection])
    
    return [messages, connection!];
}