import { useEffect, useRef, useState } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import styles from "./styles.module.css";
import { Outlet, useNavigate } from 'react-router';
import axios from 'axios';
import Form from '../../components/Form.js';


export default function AuthenticationWindow() {
  const {hubConnection} = useServerContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!hubConnection || hubConnection.state !== "Connected"){
      navigate("/connect", {replace: true});
    }
  }, [hubConnection, navigate]);
  if(!hubConnection) return null;
  
  return (
    <div>
        <Outlet></Outlet>
    </div>)
}
