<!-- src/App.svelte -->
<script>
  import router from 'page';
  import PageHome from './pages/PageHome.svelte';
  import PageLogin from './pages/PageLogin.svelte';
  import PageUsers from './pages/PageUsers.svelte';
  import PageUserItems from './pages/PageUserItems.svelte';

  let page = PageHome;
  let params = {};

  router('/', () => {
    page = PageHome;
  });

  router('/login', () => {
    page = PageLogin;
  });

  router('/users', () => {
    page = PageUsers;
  });

  router('/users/:userId/items', (context) => {
    page = PageUserItems;
    params = context.params;
  });

  router.start();
</script>

<svelte:component this={page} {params} />