// src/stores/auth.ts
import { writable } from 'svelte/store';

export const token = writable<string | null>(localStorage.getItem('token'));
export const userId = writable<number | null>(localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null);

token.subscribe((value) => {
    if (value) {
        localStorage.setItem('token', value);
    } else {
        localStorage.removeItem('token');
    }
});

userId.subscribe((value) => {
    if (value !== null) {
        localStorage.setItem('userId', value.toString());
    } else {
        localStorage.removeItem('userId');
    }
});