// app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import apiClient from '../../lib/apiClient';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { token, userId, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}/items`}>
              {user.name} {user.id === userId ? '(You)' : ''}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}