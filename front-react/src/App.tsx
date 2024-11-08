import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Login from './components/Login';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import UserList from './components/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import { getToken, removeToken, saveToken } from './services/authService';
import apiClient from './utils/apiClient';

const ItemManagement: React.FC<{ token: string; loggedInUserId: number }> = ({ token, loggedInUserId }) => {
    const { userId: routeUserId } = useParams<{ userId: string }>();
    const userId = Number(routeUserId);
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const response = await apiClient.get(`/users/${userId}/items`);
            console.log('Fetched items', response.data);
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchItems();
        }
    }, [userId]);

    return (
        <div>
            <button onClick={() => window.history.back()}>Back</button>
            {loggedInUserId === userId && (
                <AddItem token={token} onItemAdded={fetchItems} />
            )}
            <ItemList items={items} fetchItems={fetchItems} />
        </div>
    );
};

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(getToken());
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.userId);
        } else {
            setUserId(null);
        }
    }, [token]);

    const handleLogin = (token: string) => {
        saveToken(token);
        setToken(token);
        setUserId(JSON.parse(atob(token.split('.')[1])).userId);
    };

    const handleLogout = () => {
        removeToken();
        setToken(null);
        setUserId(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={token ? <Navigate to="/users" /> : <Login setToken={handleLogin} />} />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute token={token}>
                          <button onClick={handleLogout}>Logout</button>
                          <UserList userId={userId!} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:userId/items"
                    element={
                        <ProtectedRoute token={token}>
                          <ItemManagement token={token!} loggedInUserId={userId!} />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to={token ? "/users" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;