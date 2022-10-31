<script lang="ts" setup>
import Action from './Action.vue';
import { User, chooseUser } from '@/api/user'
import { toRefs } from 'vue';

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
        <var-icon transition="100" name="account-circle-outline" />
    </Action>
</template>

<style scoped>
.user {}

.active {
    @apply border-light-500;
}

.normal {
    @apply border-transparent;
}
</style>