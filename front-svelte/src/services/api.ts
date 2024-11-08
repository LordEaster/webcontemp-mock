// src/services/api.ts
import { get } from 'svelte/store';
import { token } from '../stores/auth';

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    let headers: HeadersInit = options.headers || {};
    const authToken = get(token);

    if (authToken) {
        headers = { ...headers, Authorization: `Bearer ${authToken}` };
    }

    const response = await fetch(`https://mockwebapi.bsospace.com${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
    }

    return response.json();
}