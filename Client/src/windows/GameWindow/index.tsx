import { Layer, Stage } from "react-konva";
import { useServerContext } from "../../hooks/useServerContext.js";
import PokerTable from "../../components/PokerTable.js";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import type TextMessageEvent from "../../responses/TextMessageEvent.js";
import type FileMessageEvent from "../../responses/FileMessageEvent.js";
import axios from "axios";

export default function GameWindow()  {
    const {selfIdRef, hubConnection, setMessages, serverUrl} = useServerContext();
    const navigate = useNavigate();
    useEffect(()=>{
        if (!selfIdRef.current || !hubConnection || hubConnection.state !== "Connected"){
            navigate("/authentication");
            return;
        }
        hubConnection.on('TextMessage', (message: TextMessageEvent)=>{
            setMessages(prev => [...prev, {message: message.text, sender: message.sender, timestamp: message.timestamp}]);
        });
        hubConnection.on('FileMessage', (message: FileMessageEvent)=>{
            alert(message.fileUrl);
        })
        hubConnection.on('Warning', (message)=>{
            alert(message);
        });
        const chatUpdateUrl = new URL("/load/chat", serverUrl);
        axios.get(chatUpdateUrl.href)
            .then(x=>setMessages(x.data))
            .then(()=>alert("uploaded"))
            .catch(err=>alert(err.message));
        
        return ()=>{
            hubConnection!.off("TextMessage");
            hubConnection!.off("FileMessage");
            hubConnection!.off("Warning");
        }
    }, [])
    return (<div className="container">
        <div className="side_panel">

        </div>
        Game {selfIdRef.current}
        <Outlet></Outlet>
    </div>)
}