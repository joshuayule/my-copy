
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * THE FRONT DOOR (Entry Point)
 * 
 * This is the very first piece of code that runs. Its only job is to find the 
 * empty <div> in your HTML file and "mount" the entire application inside it.
 * It's like plugging a game console into a TV.
 */

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
