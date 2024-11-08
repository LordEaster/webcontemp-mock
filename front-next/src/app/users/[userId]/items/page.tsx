// app/users/[userId]/items/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../../../lib/apiClient';

interface Item {
  id: number;
  item_name: string;
  quantity: number;
}

export default function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { token, userId: loggedInUserId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;

  const isOwnProfile = loggedInUserId === Number(userId);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchItems = async () => {
      try {
        const response = await apiClient.get(`/users/${userId}/items`);
        setItems(response.data);
      } catch (err) {
        console.error('Failed to fetch items', err);
      }
    };
    if (userId) {
      fetchItems();
    }
  }, [token, userId, router]);

  const handleAddItem = async () => {
    try {
      await apiClient.post(`/users/${userId}/items`, {
        item_name: itemName,
        quantity,
      });
      setItemName('');
      setQuantity(1);
      // Refresh items
      const response = await apiClient.get(`/users/${userId}/items`);
      setItems(response.data);
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await apiClient.delete(`/items/${id}`);
      // Refresh items
      const response = await apiClient.get(`/users/${userId}/items`);
      setItems(response.data);
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div>
      <button onClick={() => router.back()}>Back</button>
      <h2>Items for User {userId}</h2>
      {isOwnProfile && (
        <div>
          <h3>Add New Item</h3>
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.item_name}</strong>: {item.quantity}
            {isOwnProfile && (
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}