<!-- src/pages/UserList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { apiFetch } from '../services/api';
    import { push } from 'svelte-spa-router';
    import { userId as loggedInUserId } from '../stores/auth';

    interface User {
    id: number;
    name: string;
    }

    let users: User[] = [];
    let error = '';

    onMount(async () => {
    try {
        users = await apiFetch('/users');
    } catch (err) {
        if (err instanceof Error) {
            error = err.message;
        } else {
            error = String(err);
        }
    }
    });

    function handleUserClick(id: number) {
    push(`/users/${id}/items`);
    }
</script>

<h2>User List</h2>
{#if error}
    <p style="color: red;">{error}</p>
{/if}
<ul>
    {#each users as user}
        <li>
            <button type="button" on:click={() => handleUserClick(user.id)} style="cursor: pointer;">
                {user.name} {user.id === $loggedInUserId ? '(You)' : ''}
            </button>
        </li>
    {/each}
</ul>