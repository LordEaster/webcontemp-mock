import React, { useState } from 'react';
import apiClient from '../utils/apiClient';

interface LoginProps {
    setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const response = await apiClient.post('/login', { email, password });
        console.log('Login successful', response.data);
        setToken(response.data.token);
        } catch (error) {
        console.error('Login failed', error);
        alert('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
            <label>Email:</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Password:</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button type="submit">Login</button>
        </form>
    );
};

export default Login;