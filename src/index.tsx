import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer and process available globally for html-to-docx
window.Buffer = window.Buffer || Buffer;
if (typeof window.process === 'undefined') {
  window.process = process;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
