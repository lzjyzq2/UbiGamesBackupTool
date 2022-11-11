<script lang="ts" setup>
import { computed, toRefs } from 'vue';

const props = defineProps<{
    value?: string,
    placeholder: string,
}>()

const {
    value,
    placeholder
} = toRefs(props)

const emit = defineEmits<{
    (e: 'update:value', value: string): void
}>()

const name = computed(() => value?.value ? 'close-circle' : 'magnify')

const handleClick = () => {
    if (value?.value) {
        emit('update:value', '')
    }
}

const handleInput = (e: Event) => {
    emit('update:value', (e?.target as HTMLInputElement)?.value)
}
</script>

<template>
    <div class="flex flex-row bg-$filter-input-bg-color rounded-md px-8px py-6px">
        <input type="text" class="appearance-none flex-1 border-0 outline-none bg-transparent" :value="value"
            @input="handleInput" :placeholder="placeholder" />
        <var-icon :name="name" class="cursor-pointer" transition="100" @click="handleClick" />
    </div>
</template>