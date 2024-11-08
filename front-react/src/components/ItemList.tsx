import React from 'react';
import apiClient from '../utils/apiClient';

interface Item {
    id: number;
    item_name: string;
    quantity: number;
    name?: string;
}

interface ItemListProps {
    items: Item[];
    fetchItems: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, fetchItems }) => {
    const deleteItem = async (id: number) => {
        try {
            await apiClient.delete(`/items/${id}`);
            fetchItems();
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0', borderRadius: '8px' }}>
            <h2>Items</h2>
            {items.length === 0 ? (
                <p>No items available</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id} style={{ marginBottom: '8px', padding: '8px', borderBottom: '1px solid #eee' }}>
                            <strong>{item.item_name}</strong>: {item.quantity}
                            {item.name && <span> (Owner: {item.name})</span>}
                            <button
                                onClick={() => deleteItem(item.id)}
                                style={{ marginLeft: '16px', padding: '4px 8px', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItemList;