import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import ConnectWindow from "./windows/ConnectionWindow/index.jsx";
import AuthenticationWindow from "./windows/AuthenticationWindow/index.jsx";
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Navigate to="/connect"></Navigate>}/>
  <Route path="/connect" element={<ConnectWindow></ConnectWindow>}/>
  <Route path="/authentication" element={<AuthenticationWindow></AuthenticationWindow>}/>
  </Routes>
  </BrowserRouter>
  </StrictMode>,
  
)
