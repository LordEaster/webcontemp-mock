// src/stores/authStore.js
import { writable } from 'svelte/store';

export const authStore = writable({
  isAuthenticated: false,
  token: null,
  userId: null,
});

export function setAuthToken(token) {
  // Decode token to extract user ID (assuming JWT)
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId;

  authStore.set({
    isAuthenticated: !!token,
    token,
    userId,
  });
}

export function logout() {
  authStore.set({
    isAuthenticated: false,
    token: null,
    userId: null,
  });
  localStorage.removeItem('token');
}