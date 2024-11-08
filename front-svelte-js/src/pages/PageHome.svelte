<!-- src/pages/PageHome.svelte -->
<script>
  import navigate from 'page';
</script>

<h1>Welcome to the Home Page</h1>
<button on:click="{() => navigate('/login')}">Go to Login</button>
<button on:click="{() => navigate('/users')}">View Users</button>