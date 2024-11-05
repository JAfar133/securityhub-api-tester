import React, { createContext, useState, ReactNode } from 'react';
import { setAuthToken } from '../services/api';

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthContextType {
    tokens: Tokens | null;
    saveTokens: (tokens: Tokens) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    tokens: null,
    saveTokens: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const existingTokensString = localStorage.getItem('tokens');
    const existingTokens: Tokens | null = existingTokensString ? JSON.parse(existingTokensString) : null;

    const [tokens, setTokens] = useState<Tokens | null>(existingTokens);

    const saveTokens = (data: Tokens) => {
        localStorage.setItem('tokens', JSON.stringify(data));
        setTokens(data);
        setAuthToken(data.access_token);
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        setTokens(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ tokens, saveTokens, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
