<script lang="ts" setup>
import { getCurrentComponent } from './service';

const currentComponent = getCurrentComponent()
</script>
<template>
    <div class="home-layout">
        <settings-sidebar />
        <div class="middle">
            <component :is="currentComponent.component" />
        </div>
    </div>
</template>


<style scoped>
.home-layout {
    @apply flex flex-row h-[100vh] w-[100%] overflow-hidden;
}

.home-layout .middle {
    @apply h-[100%] w-[100%] overflow-x-hidden overflow-y-auto p-16px;
}
</style>

<style>
.resolve-collapse{
    z-index: 0;
}
.resolve-collapse-item {
}

.resolve-collapse-item::before {
    z-index: -1;
}
</style>