import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loader } from '@monaco-editor/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { checkEnv } from './checkEnv.ts';

// Check environment variables
checkEnv();

// Configure Monaco Editor to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);