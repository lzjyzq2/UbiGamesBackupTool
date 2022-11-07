<script lang="ts" setup>
import Action from './Action.vue';
import { User, chooseUser } from '@/api/user'
import { toRefs } from 'vue';
import usericon from '@/assets/img/user.png'

const props = defineProps<{
    user: User,
    active: boolean
}>()

const {
    user
} = toRefs(props)
</script>

<template>
    <Action :label="user.uuid??''" @click="chooseUser(user)" class="user" :class="[active?'active':'normal']">
        <!-- <var-icon transition="100" name="account-circle-outline" /> -->
        <var-image :src="user.picture" :error="usericon" lazy :radius="999" width="30" height="30" fit="fill" />
    </Action>
</template>

<style scoped>
.user {
}

.active {
    @apply border-light-500;
}

.normal {
    @apply border-transparent;
}
</style>