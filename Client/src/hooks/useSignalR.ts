import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ChatMessage{
    message: string,
    sender: string,
    id?: number
}

export default function useSignalR(connectionUrl: string): [ChatMessage[], HubConnection] {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connection, setConnection] = useState<null | HubConnection>(null);

    function AddMessage(message: ChatMessage){
        message = {...message, id: messages.length}
        setMessages(prev=>[...prev, message]);
    }

    useEffect(() => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(connectionUrl+"/chat")
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
                AddMessage({sender, message});
            });
            connection.on('Connected', (ip: string)=>{
                console.log(`player ${ip} connected`);
                AddMessage({sender: "server", message: `${ip} connected`});
            });
            connection.invoke('LoadAllMessages');
            connection.on('AllMessages', (messages: ChatMessage[])=>{
                console.log(messages);
                messages.forEach(m=>AddMessage(m));
            });
            connection.on("Warning", (reason: string)=>{
                alert(reason);
            })
        })
        .catch(()=>console.log('unable to connect'))
        return ()=>{
            connection.off('Receive');
            connection.off('LoadAllMessages');
            connection.off('Connected');
            connection.stop();
        }
    }, [connection])
    
    return [messages, connection!];
}