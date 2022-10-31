<script lang="ts" setup>
</script>

<template>
    <div class="layout">
        <RouterView />
    </div>
</template>

<style>
.layout {
    @apply flex flex-row h-[100vh] overflow-hidden;
    transition: background-color .25s, color .25s;
    color: var(--color-text);
    background-color: var(--color-body);
}
</style>