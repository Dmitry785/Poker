import { useRef, useState } from 'react'
import useSignalR from './hooks/useSignalR.js';

const defaultServerHost = 'http://10.0.0.159:5138';

function App() {
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [serverHost, setServerHost] = useState(defaultServerHost);
  const [selectedServerHost, setSelectedServerHost] = useState(defaultServerHost);
  const [messages, connection] = useSignalR(selectedServerHost);

  const onSend = ()=>{
    console.log(`Sending message ${message}`);
    setMessage('');
    
    connection.invoke('Send', message);
  }
  const onConnect = ()=>{
    setSelectedServerHost(serverHost);
  }
  const onReg = ()=>{
    const Url = new URL(selectedServerHost+"/reg");
    const search = new URLSearchParams();
    search.append("nickname", nickname);
    Url.search = search.toString();
    fetch(Url.toString());
  }

  return (
    <div>
      <input value={nickname} onInput={(e)=>setNickname((e.target as HTMLInputElement).value)}></input>
      <button onClick = {onReg}>Register</button>
      <input value={serverHost} onInput={(e)=>setServerHost((e.target as HTMLInputElement).value)}></input>
      <button onClick = {onConnect}>Connect</button>
      <form onSubmit={(e)=>{e.preventDefault(); onSend();}}>
        <input value={message} onInput={(e)=>setMessage((e.target as HTMLInputElement).value)}></input>
        <button type='submit'>Send</button>
      </form>
      {messages.map(m=>(<div key={m.id}>
          {`${m.sender} >> ${m.message}`}
        </div>))}
    </div>
  )
}

export default App
