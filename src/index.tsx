import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setAuthToken } from './services/api';

import { AuthProvider } from './context/AuthContext';

const tokensString = localStorage.getItem('tokens');
if (tokensString) {
    const tokens = JSON.parse(tokensString);
    setAuthToken(tokens.access_token);
}

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <App />
            </AuthProvider>
        </React.StrictMode>
    );
} else {
    throw new Error('Root element not found');
}