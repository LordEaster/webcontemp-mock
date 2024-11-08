// src/global.d.ts

/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
    import { SvelteComponentTyped } from 'svelte';
    export default class SvelteComponent extends SvelteComponentTyped {}
}