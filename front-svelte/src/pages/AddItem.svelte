<!-- src/components/AddItem.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { apiFetch } from '../services/api';
  
    export let routeUserId: string;
    const dispatch = createEventDispatcher();
  
    let item_name = '';
    let quantity = 1;
    let error = '';
  
    async function handleAddItem() {
      error = '';
      try {
        await apiFetch(`/users/${routeUserId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_name, quantity }),
        });
        item_name = '';
        quantity = 1;
        dispatch('itemAdded');
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'An unknown error occurred';
        }
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleAddItem}>
    <h3>Add New Item</h3>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    <div>
      <label>Item Name:</label>
      <input type="text" bind:value={item_name} required />
    </div>
    <div>
      <label>Quantity:</label>
      <input type="number" bind:value={quantity} min="1" required />
    </div>
    <button type="submit">Add Item</button>
  </form>