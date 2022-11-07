<script lang="ts" setup>
</script>
<template>
    <div class="home-layout">
        <Sidebar />
        <div class="middle">
            <RouterView />
        </div>
    </div>
</template>


<style scoped>
.home-layout {
    @apply flex flex-row h-[100vh] w-[100%] overflow-hidden bg-$home-bg-color;
}
.home-layout .middle{
    @apply h-[100%] w-[100%] overflow-hidden px-16px;
}
</style>