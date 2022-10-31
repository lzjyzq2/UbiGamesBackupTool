<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const homePath = ['/', '/home', '/home/backup']
const route = useRoute()
const router = useRouter()

const isHome = computed(() => homePath.includes(route.fullPath) )
const name = computed(() => isHome.value ? 'home' : 'chevron-left')
const label = computed(() => isHome.value ? '首页' : '返回')

const back = () =>{
    if(!isHome.value){
        router.back()
    }
}
</script>

<template>
    <action :label="label" @click="back">
        <var-icon transition="100" :name="name"/>
    </action>
</template>