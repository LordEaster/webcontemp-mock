<script lang="ts">
  import Router from 'svelte-spa-router';
  import routes from './routes';
  import { token } from './stores/auth';
  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';

  $: if (!$token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    push('/login');
  }
</script>

<main>
  <Router {routes} />
</main>