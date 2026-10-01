import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import ConnectWindow from "./windows/ConnectionWindow/index.jsx";
import AuthenticationWindow from "./windows/AuthenticationWindow/index.jsx";
import GameWindow from "./windows/GameWindow/index.jsx";
import './index.css';
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import { ServerContextProvider } from './hooks/useServerContext.jsx';
import PokerTable from './components/PokerTable.js';
import GameChat from "./components/GameChat.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <ServerContextProvider>
  <Routes>
  <Route path="/" element={<Navigate to="/connect"></Navigate>}/>
  <Route path="/connect" element={<ConnectWindow></ConnectWindow>}/>
  <Route path="/authentication" element={<AuthenticationWindow></AuthenticationWindow>}>
    <Route index element={<Login></Login>}/>
    <Route path="register" element={<Register></Register>}/>
  </Route>
  <Route path="/game" element={<GameWindow></GameWindow>}>
    <Route index element={<PokerTable></PokerTable>}/>
    <Route path="chat" element={<GameChat></GameChat>}/>
  </Route>
  </Routes>
  </ServerContextProvider>
  </BrowserRouter>
  </StrictMode>,
)
