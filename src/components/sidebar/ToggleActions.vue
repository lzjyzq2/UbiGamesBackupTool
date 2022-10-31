<script lang="ts" setup>
import { toggleAction, fold } from '@/api/action'
import { computed } from 'vue';

const name = computed(() => fold.value ? 'menu' : 'menu-open')
const label = computed(() => fold.value ? '展开' : '折叠')
</script>

<template>
    <Action :label="label" @click="toggleAction" >
        <var-icon transition="100" :name="name"/>
    </Action>
</template>

<style>

</style>