
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createStorageBucketIfNotExists } from './services/storageService';

// Initialize storage bucket
createStorageBucketIfNotExists();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
