<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const activeKey = computed(() => {
    for (const action of actions) {
        if (action.path.includes(route.path)) {
            return action.key
        }
    }
    return ''
})

const actions = [
    {
        key: 'backup',
        label: "备份",
        icon: "download",
        path: ['/', '/home', '/home/backup'],
        action: function () {
            router.push({ path: '/' })
        }
    }, {
        key: 'restore',
        label: "还原",
        icon: "upload",
        path: ['/restore'],
        action: async function () {
            router.push({ path: '/restore' })
        }
    },
]

const doAction = (item: { key: string, action: () => void }) => {
    if (activeKey.value !== item.key) {
        item.action()
    }
}
</script>

<template>
    <action :label="item.label" @click="doAction(item)" v-for="(item,idx) in actions" :key="idx" class="mode"
        :class="{active:activeKey===item.key}">
        <var-icon transition="100" :name="item.icon" />
    </action>
</template>
<style scoped>
.mode {
    @apply mt-8px cursor-pointer;
}

.mode:first-child {
    @apply mt-0px;
}

.mode.active {
    background-color: aqua;
}
</style>