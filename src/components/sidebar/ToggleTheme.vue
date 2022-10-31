<script lang="ts" setup>
import { toggleTheme,isDark } from '@/api/theme'
import { computed } from 'vue';

const label = computed(() => isDark.value ?  '暗色模式': '明亮模式')
const name = computed(() => isDark.value ? 'weather-night' : 'white-balance-sunny')

</script>

<template>
    <Action :label="label" @click="toggleTheme">
        <var-icon transition="100" :name="name" />
    </Action>
</template>

<style>

</style>