import { useEffect } from 'react';
import { useServerContext } from '../../hooks/useServerContext.js';
import styles from "./styles.module.css";
import { Outlet, useNavigate } from 'react-router';

export default function AuthenticationWindow() {
  const {hubConnection, connect} = useServerContext();
  const navigate = useNavigate();
  useEffect(()=>{
        let lock = true;

        connect()
            .then((hubConnection)=>{
                if(!lock) return;
                hubConnection.onclose(()=>{if(lock) navigate("/connect", {replace: true})});
            })
            .catch(()=>{
                if (!lock) return;
                navigate("/connect", {replace: true});
            });
        
        return ()=>{
            lock = false;
        }
    }, [navigate]);
  
  return (
    <div>
        <Outlet></Outlet>
    </div>)
}
