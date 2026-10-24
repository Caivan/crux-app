import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@crux/design-system/tokens.css';
import App from './App';

const root=document.getElementById('root');
if(!root)throw new Error('App root element is missing.');
createRoot(root).render(<StrictMode><App/></StrictMode>);
