import { useState } from 'react'
import useSignalR from './hooks/useSignalR.js';

function App() {
  const [message, setMessage] = useState('');
  const [messages, connection] = useSignalR('http://localhost:5138/chat');

  const onSend = ()=>{
    console.log(`Sending message ${message}`);
    connection.invoke('Send', message, 'Anonimous');
  }
  return (
    <div>
      <input value={message} onInput={(e)=>setMessage(e.target.value)}></input>
      <button onClick = {onSend}>Send</button>
    </div>
  )
}

export default App
