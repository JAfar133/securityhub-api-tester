// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { Pane, TextInputField, Button, Heading, toaster } from 'evergreen-ui';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { saveTokens } = useContext(AuthContext);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            saveTokens(response.data);
            toaster.success('Successfully logged in');
        } catch (error) {
            toaster.danger('Login failed. Please check your credentials.');
        }
    };

    return (
        <Pane display="flex" alignItems="center" justifyContent="center" height="100vh">
            <Pane width={400} padding={16} background="tint2" borderRadius={4}>
                <Heading size={600} marginBottom={16}>
                    Login
                </Heading>
                <form onSubmit={handleSubmit}>
                    <TextInputField
                        label="Email"
                        required
                        value={email}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                    />
                    <TextInputField
                        label="Password"
                        required
                        type="password"
                        value={password}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                    />
                    <Button appearance="primary" type="submit">
                        Log In
                    </Button>
                </form>
            </Pane>
        </Pane>
    );
};

export default LoginPage;
