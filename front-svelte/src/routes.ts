// src/routes.ts
import Login from './pages/Login.svelte';
import UserList from './pages/UserList.svelte';
import ItemList from './pages/ItemList.svelte';

export default {
    '/login': Login,
    '/users': UserList,
    '/users/:userId/items': ItemList,
};