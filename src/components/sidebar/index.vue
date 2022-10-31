<script lang="ts" setup>
import { User, getAllUsers, initAllUsers, getCurrentUser, chooseUser } from '../../api/user'
const users = getAllUsers()

const currentUser = getCurrentUser()
const doChooseUser = (targetUser: User) => {
    if (targetUser.key !== currentUser?.value?.key) {
        chooseUser(targetUser)
    }
}
</script>

<template>
    <div class="sidebar">
        <div class="action-group">
            <RouteBack />
        </div>
        <div class="action-group">
            <ToggleTheme />
            <ToggleActions />
        </div>
        <div class="action-group">
            <ToggleMode />
        </div>
        <div class="action-group flex-1 overflow-auto">
            <UserItem v-for="item in users" :user="item" :key="item.key" :active="item.key===currentUser?.key"
                @click="doChooseUser(item)" />
        </div>

        <div class="action-group">
            <ToSettings />
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
</style>