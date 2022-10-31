<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const toSettings = () => {
    router.push('/settings')
}
</script>

<template>
    <Action label="设置" @click="toSettings">
        <var-icon transition="100" name="cog"  />
    </Action>
</template>

<style>

</style>