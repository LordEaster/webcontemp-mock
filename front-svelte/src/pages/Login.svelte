<!-- src/pages/Login.svelte -->
<script lang="ts">
    import { token, userId } from '../stores/auth';
    import { apiFetch } from '../services/api';
    import { push } from 'svelte-spa-router';
    import { writable } from 'svelte/store';

    let email = '';
    let password = '';
    const error = writable('');

    async function handleLogin() {
        error.set('');
        try {
            const data = await apiFetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            });
            token.set(data.token);
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            userId.set(payload.userId);
            push('/users');
        } catch (err) {
            if (err instanceof Error) {
                error.set(err.message);
            } else {
                error.set('An unknown error occurred');
            }
        }
    }
</script>

<form on:submit|preventDefault={handleLogin}>
    <h2>Login</h2>
    {#if $error}
        <p style="color: red;">{$error}</p>
    {/if}
    <div>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />
    </div>
    <div>
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    <button type="submit">Login</button>
</form>