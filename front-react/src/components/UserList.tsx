import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
}

interface UserListProps {
    userId: number; // Logged-in user's ID
}

const UserList: React.FC<UserListProps> = ({ userId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = (userId: number) => {
        navigate(`/users/${userId}/items`);
    };

    return (
        <div style={{ padding: '16px' }}>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        style={{
                            padding: '8px',
                            marginBottom: '8px',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}
                    >
                        {user.name} {user.id === userId && "(You)"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;