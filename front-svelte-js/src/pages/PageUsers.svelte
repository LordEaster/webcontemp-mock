<!-- src/pages/PageUsers.svelte -->
<script>
  import { onMount } from 'svelte';
  import apiClient from '../lib/apiClient';
  import { authStore, logout } from '../stores/authStore';
  import navigate from 'page';

  let users = [];
  let error = '';
  let unsubscribe;

  onMount(() => {
    unsubscribe = authStore.subscribe((store) => {
      if (!store.isAuthenticated) {
        navigate('/login');
      }
    });

    fetchUsers();

    return () => {
      unsubscribe();
    };
  });

  async function fetchUsers() {
    try {
      const response = await apiClient.get('/users');
      users = response.data;
    } catch (err) {
      error = 'Failed to fetch users';
      console.error(err);
    }
  }

  function goToUserItems(userId) {
    navigate(`/users/${userId}/items`);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }
</script>

<h1>User List</h1>
<button on:click="{handleLogout}">Logout</button>

{#if error}
  <p style="color: red;">{error}</p>
{:else}
  <ul>
    {#each users as user}
      <li on:click="{() => goToUserItems(user.id)}">{user.name}</li>
    {/each}
  </ul>
{/if}