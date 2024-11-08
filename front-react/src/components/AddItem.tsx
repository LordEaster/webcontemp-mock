import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

interface AddItemProps {
    token: string;
    onItemAdded: () => void;
}

const AddItem: React.FC<AddItemProps> = ({ token, onItemAdded }) => {
    const { userId: routeUserId } = useParams<{ userId: string }>();
    const [item_name, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState<{ item_name?: string; quantity?: number }>({});

    const validate = () => {
        const newErrors: { item_name?: string; quantity?: number } = {};
        if (!item_name) newErrors.item_name = 'Name is required';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        try {
            await apiClient.post(`/users/${routeUserId}/items`, { item_name, quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItemName('');
            setQuantity('');
            setErrors({});
            onItemAdded(); // Call onItemAdded to trigger a refresh in ItemList
        } catch (error) {
            console.error('Failed to add item', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0', borderRadius: '8px' }}>
            <h2>Add New Item</h2>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={item_name}
                    onChange={(e) => setItemName(e.target.value)}
                    style={{ margin: '8px 0', padding: '8px', width: '100%' }}
                />
                {errors.item_name && <small style={{ color: 'red' }}>{errors.item_name}</small>}
            </div>
            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    defaultValue={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ margin: '8px 0', padding: '8px', width: '100%' }}
                />
                {errors.quantity && <small style={{ color: 'red' }}>{errors.quantity}</small>}
            </div>
            <button type="submit" style={{ padding: '8px 16px', marginTop: '8px', cursor: 'pointer' }}>Add Item</button>
        </form>
    );
};

export default AddItem;