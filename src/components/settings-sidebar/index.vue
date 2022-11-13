<script lang="ts" setup>
import { getFold, setFold } from '@/api/action';
import { setCurrentComponent, getCurrentComponent, settingsComponents, SettingsComponent } from '@/pages/settings/service';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const foldbak = getFold()
const route = useRoute()
const router = useRouter()

const back = () => {
    router.back()
    
}

onMounted(() => {
    setFold(false)
})


onUnmounted(()=>{
    setFold(foldbak)
})
const currentComponent = getCurrentComponent()
const doSetCurrentComponent = (component: SettingsComponent) => {
    if (currentComponent.value.name !== component.name) {
        setCurrentComponent(component)
    }
}
</script>

<template>
    <div class="sidebar">
        <div class="action-group flex-1">
            <action :label="item.label" @click="doSetCurrentComponent(item)" v-for="item in settingsComponents"
                :key="item.name" class="mode" :class="{active:currentComponent.name===item.name}">
                <var-icon transition="100" :name="item.icon" />
            </action>
        </div>
    </div>
</template>
<style scoped>
.sidebar {
    @apply flex flex-col h-[100%];
}

.action-group+.action-group {
    @apply mt-8px;
}

.action-group {
    @apply rounded-r-md p-8px bg-$action-group-bg-color;
}

.action-group .action {
    @apply mt-8px cursor-pointer;
}

.action-group .action:first-child {
    @apply mt-0px;
}

.mode {
    @apply mt-8px cursor-pointer;
}

.mode:first-child {
    @apply mt-0px;
}

.mode.active {
    background-color: var(--toggle-mode-active-color);
}
</style>