<script lang="ts" setup>
import { toRefs } from 'vue';
import { fold } from '@/api/action'


const props = defineProps<{
    label: string
}>()

const {
    label
} = toRefs(props)

</script>

<template>
    <div class="action" :class="[fold?'close':'open']">
        <div class="icon flex flex-shrink-0 justify-center items-center">
            <slot />
        </div>
        <div class="label" v-if="!fold">
            {{label}}
        </div>
    </div>
</template>
<style>
.action {
    @apply rounded-full bg-$action-bg-color flex flex-row items-center text-white h-[32px] border-transparent border-1;
    transition:width 500ms;
}
.action.open{
    @apply w-[120px];
}
.action.close{
    @apply w-[32px];
}
.action .icon{
    @apply w-[30px] h-[30px];
}
.action .label{
    @apply flex-1 flex-nowrap whitespace-nowrap mr-8px select-none overflow-hidden;
}
</style>