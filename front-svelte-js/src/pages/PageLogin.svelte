<!-- src/pages/PageLogin.svelte -->
<script>
  import navigate from 'page';
  import { authStore, setAuthToken } from '../stores/authStore';
  import apiClient from '../lib/apiClient';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let error = '';

  async function login() {
    try {
      const response = await apiClient.post('/login', { email, password });
      const token = response.data.token;

      setAuthToken(token);
      localStorage.setItem('token', token);

      navigate('/users');
    } catch (err) {
      error = err.response?.data?.error || 'Invalid email or password';
      console.error('Login failed:', err);
    }
  }

  // Retrieve token from localStorage on mount
  onMount(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  });
</script>

<h1>Login Page</h1>

{#if error}
  <p style="color: red;">{error}</p>
{/if}

<div>
  <input type="email" placeholder="Email" bind:value="{email}" required />
  <input type="password" placeholder="Password" bind:value="{password}" required />
  <button on:click="{login}">Login</button>
</div>