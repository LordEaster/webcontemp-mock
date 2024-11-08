<!-- src/pages/PageUserItems.svelte -->
<script>
  import { onMount } from 'svelte';
  import apiClient from '../lib/apiClient';
  import { authStore } from '../stores/authStore';
  import navigate from 'page';

  export let params;
  let items = [];
  let itemName = '';
  let quantity = 1;
  let error = '';
  let success = '';
  let isOwnProfile = false;

  onMount(() => {
    const unsubscribe = authStore.subscribe((store) => {
      if (!store.isAuthenticated) {
        navigate('/login');
      } else {
        isOwnProfile = params.userId == store.userId;
      }
    });

    fetchItems();

    return () => {
      unsubscribe();
    };
  });

  async function fetchItems() {
    try {
      const response = await apiClient.get(`/users/${params.userId}/items`);
      items = response.data;
    } catch (err) {
      error = 'Failed to fetch items';
      console.error(err);
    }
  }

  async function addItem() {
    try {
      const response = await apiClient.post(`/users/${params.userId}/items`, {
        item_name: itemName,
        quantity,
      });
      items = [...items, response.data];
      success = 'Item added successfully!';
      itemName = '';
      quantity = 1;
    } catch (err) {
      error = 'Failed to add item';
      console.error(err);
    }
  }

  async function deleteItem(itemId) {
    try {
      await apiClient.delete(`/items/${itemId}`);
      items = items.filter((item) => item.id !== itemId);
    } catch (err) {
      error = 'Failed to delete item';
      console.error(err);
    }
  }
</script>

<h1>Items for User {params.userId}</h1>

<button on:click="{() => navigate('/users')}">Back to Users</button>

{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if success}
  <p style="color: green;">{success}</p>
{/if}

{#if isOwnProfile}
  <h2>Add New Item</h2>
  <form on:submit|preventDefault="{addItem}">
    <input type="text" placeholder="Item Name" bind:value="{itemName}" required />
    <input type="number" min="1" placeholder="Quantity" bind:value="{quantity}" required />
    <button type="submit">Add Item</button>
  </form>
{/if}

<ul>
  {#each items as item}
    <li>
      <strong>{item.item_name}</strong>: {item.quantity}
      {#if isOwnProfile}
        <button on:click="{() => deleteItem(item.id)}">Delete</button>
      {/if}
    </li>
  {/each}
</ul>