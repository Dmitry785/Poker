import { Layer, Stage } from "react-konva";
import { useServerContext } from "../../hooks/useServerContext.js";
import PokerTable from "../../components/PokerTable.js";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import axios from "axios";
import type {MessageData} from "../../responses/MessageData.js";

export default function GameWindow()  {
    const {selfIdRef, hubConnection, setMessages, serverUrl} = useServerContext();
    const navigate = useNavigate();
    useEffect(()=>{
        if (!selfIdRef.current || !hubConnection || hubConnection.state !== "Connected"){
            navigate("/connect");
            return;
        }
        hubConnection.on('NewMessage', (message: MessageData)=>{
            setMessages(prev => [...prev, message]);
        });
        hubConnection.on('Warning', (message)=>{
            alert(message);
        });
        const chatUpdateUrl = new URL("/load/chat", serverUrl);
        axios.get(chatUpdateUrl.href)
            .then(x=>setMessages(x.data))
            .catch(err=>alert(err.message));
        
        return ()=>{
            hubConnection!.off("NewMessage");
            hubConnection!.off("Warning");
        }
    }, [])
    return (<div className="container">
        <div className="side_panel">
            <Link to={'/game/chat'}>Chat</Link>
            <Link to={'/game'}>Table</Link>
        </div>
        Game {selfIdRef.current}
        <Outlet></Outlet>
    </div>)
}