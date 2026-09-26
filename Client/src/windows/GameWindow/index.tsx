import { Layer, Stage } from "react-konva";
import { useServerContext } from "../../hooks/useServerContext.js";
import PokerTable from "../../components/PokerTable.js";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import type NewMessageEvent from "../../responses/NewMessageEvent.js";
import axios from "axios";

export default function GameWindow()  {
    const {selfIdRef, hubConnection, setMessages, serverUrl} = useServerContext();
    const navigate = useNavigate();
    useEffect(()=>{
        if (!selfIdRef.current || !hubConnection || hubConnection.state !== "Connected"){
            navigate("/authentication");
            return;
        }
        hubConnection.on('NewMessage', (message: NewMessageEvent)=>{
            setMessages(prev => [...prev, {sender: message.sender, 
                message: message.message, timestamp: message.timestamp}]);
        });
        hubConnection.on('Warning', (message)=>{alert(message)});
        const chatUpdateUrl = new URL("/load/chat", serverUrl);
        axios.get(chatUpdateUrl.href)
        .then(x=>setMessages(x.data))
        .catch(err=>alert(err.message));
        
        return ()=>{
            hubConnection!.off("NewMessage");
            hubConnection!.off("Warning");
        }
    }, [])
    return (<div>
        Game {selfIdRef.current}
        <Outlet></Outlet>
    </div>)
}