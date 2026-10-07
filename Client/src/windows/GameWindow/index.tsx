import { Layer, Stage } from "react-konva";
import { useServerContext } from "../../hooks/useServerContext.js";
import PokerTable from "../../components/PokerTable.js";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import axios from "axios";
import type {MessageData} from "../../responses/MessageData.js";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

export default function GameWindow()  {
    const {selfIdRef, setMessages, serverUrl, hubConnection, connect} = useServerContext();
    const navigate = useNavigate();
    useEffect(()=>{
        let lock = true;
        let activeHubConnection: HubConnection | null = null;
       
        connect()
            .then((hubConnection)=>{
                if(!lock) return;
                activeHubConnection = hubConnection;
                hubConnection.on('NewMessage', (message: MessageData)=>{
                    if(lock) setMessages(prev => [...prev, message]);
                });
                hubConnection.on('Warning', (message)=>{
                    if(lock) alert(message);
                });
                const chatUpdateUrl = new URL("/load/chat", serverUrl);
                axios.get(chatUpdateUrl.href)
                    .then(x=>{
                        if (lock) 
                            setMessages(x.data);})
                    .catch(err=>{
                        if (lock) 
                            alert(err.message);});
            })
            .catch(()=>{
                if(lock) navigate("/connect", {replace: true});
            });
        
        return ()=>{
            lock = false;
            if(activeHubConnection){
                activeHubConnection.off("NewMessage");
                activeHubConnection.off("Warning");
            }
        }
    }, [hubConnection, navigate]);
    return (<div className="container">
        <div className="side_panel">
            <Link to={'/game/chat'}>Chat</Link>
            <Link to={'/game'}>Table</Link>
        </div>
        Game {selfIdRef.current}
        <Outlet></Outlet>
    </div>)
}