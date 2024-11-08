<!-- src/pages/ItemList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { apiFetch } from '../services/api';
    import { userId as loggedInUserId } from '../stores/auth';
    import AddItem from './AddItem.svelte';
    import { getContext } from 'svelte';
    import { readable } from 'svelte/store';
  
    interface Item {
      id: number;
      item_name: string;
      quantity: number;
    }
  
    const { params } = getContext('routie') as { params: { userId: string } };
    let routeUserId = params.userId;
    let items: Item[] = [];
    let error = '';
    const isOwnProfile = readable<boolean>(false, (set) => {
      const unsubscribe = loggedInUserId.subscribe((id) => {
        set(parseInt(routeUserId) === id);
      });
      return () => unsubscribe();
    });
  
    async function fetchItems() {
      try {
        items = await apiFetch(`/users/${routeUserId}/items`);
      } catch (err) {
        if (err instanceof Error) {
          if (err instanceof Error) {
            error = err.message;
          } else {
            error = String(err);
          }
        } else {
          error = String(err);
        }
      }
    }
  
    onMount(fetchItems);
  
    async function handleDelete(itemId: number) {
      try {
        await apiFetch(`/items/${itemId}`, {
          method: 'DELETE',
        });
        items = items.filter((item) => item.id !== itemId);
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = String(err);
        }
      }
    }
  
    function handleItemAdded() {
      fetchItems();
    }
  </script>
  
  <h2>Items for User {routeUserId}</h2>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  
  {#if $isOwnProfile}
    <AddItem {routeUserId} on:itemAdded={handleItemAdded} />
  {/if}
  
  <ul>
    {#each items as item}
      <li>
        {item.item_name} - Quantity: {item.quantity}
        {#if $isOwnProfile}
          <button on:click={() => handleDelete(item.id)}>Delete</button>
        {/if}
      </li>
    {/each}
  </ul>