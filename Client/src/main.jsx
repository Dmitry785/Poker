import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import ConnectWindow from "./windows/ConnectionWindow/index.jsx";
import AuthenticationWindow from "./windows/AuthenticationWindow/index.jsx";
import GameWindow from "./windows/GameWindow/index.jsx";
import './index.css';
import { ServerContextProvider } from './hooks/useServerContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <ServerContextProvider>
  <Routes>
  <Route path="/" element={<Navigate to="/connect"></Navigate>}/>
  <Route path="/connect" element={<ConnectWindow></ConnectWindow>}/>
  <Route path="/authentication" element={<AuthenticationWindow></AuthenticationWindow>}/>
  <Route path="/game" element={<GameWindow></GameWindow>}/>
  </Routes>
  </ServerContextProvider>
  </BrowserRouter>
  </StrictMode>,
)
