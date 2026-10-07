import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import styles from "./styles.module.css";
import { Outlet, useNavigate } from 'react-router';
import axios from 'axios';
import Form from '../../components/Form.js';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';


export default function AuthenticationWindow() {
  const {selfIdRef, serverUrl, hubConnection, connect} = useServerContext();
  const navigate = useNavigate();
  useEffect(()=>{
        let lock = true;

        connect()
            .then((hubConnection)=>{
                if(!lock) return;
                hubConnection.onclose(()=>{if(lock) navigate("/connect", {replace: true})});
            })
            .catch(()=>{
                if(lock) navigate("/connect", {replace: true});
            });
        
        return ()=>{
            lock = false;
        }
    }, [navigate]);
  if(!hubConnection) return null;
  
  return (
    <div>
        <Outlet></Outlet>
    </div>)
}
