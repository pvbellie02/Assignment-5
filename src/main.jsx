/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This is the entry point of the TVmaze React gallery. It finds the root
  element in index.html and renders the App component into it, wrapped
  in StrictMode and BrowserRouter so the app can use client-side routes.
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
