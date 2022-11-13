<script setup lang="ts">
import { currentTheme, toggleTheme, isDark } from '@/api/theme'
import { getTitle } from './api/application';
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/img/32x32.png'
import SvgIcon from './components/SvgIcon.vue';
import { mdiWindowMinimize, mdiWindowMaximize, mdiWindowRestore, mdiWindowClose } from '@mdi/js'

import { appWindow } from '@tauri-apps/api/window'

const homePath = ['/', '/home', '/home/backup']
const route = useRoute()
const router = useRouter()

const isHome = computed(() => homePath.includes(route.fullPath))
const title = getTitle()

const back = () => {
  if (!isHome.value) {
    router.back()
  }
}

const toggleThemeIcon = computed(() => isDark.value ? 'weather-night' : 'white-balance-sunny')
// Add varlet style definition here


const minimize = () => {
  appWindow.minimize()
}

const isMaxSize = ref(false)


onMounted(() => {
  appWindow.isMaximized().then((isMax) => {
    isMaxSize.value = isMax
  })
})

const maxOrUnmaxIcon = computed(() => {
  return isMaxSize.value ? mdiWindowRestore : mdiWindowMaximize
})

const handleMaxOrUnmax = () => {
  if (isMaxSize.value) {
    appWindow.unmaximize()
    isMaxSize.value = false
  } else {
    appWindow.maximize()
    isMaxSize.value = true
  }
}

const appClose = () => {
  appWindow.close()
}
</script>

<template>
  <var-style-provider :style-vars="currentTheme">
    <div class="flex flex-col overflow-hidden h-[100vh]">
      <var-app-bar data-tauri-drag-region :title="title">
        <template #left>
          <div class="mr-2">
            <var-image :src="logo" :radius="999" width="36" height="36" fit="fill" v-if="isHome" />
            <var-button v-else round text color="transparent" text-color="#fff" @click="back">
              <var-icon name="chevron-left" :size="24" />
            </var-button>
          </div>
        </template>
        <template #right>
          <div class="grid grid-cols-4 gap-2">
            <var-button round text color="transparent" text-color="#fff" @click="toggleTheme">
              <var-icon :name="toggleThemeIcon" :size="24" />
            </var-button>
            <var-button round text color="transparent" text-color="#fff" @click="minimize">
              <svg-icon type="mdi" :path="mdiWindowMinimize"></svg-icon>
            </var-button>
            <var-button round text color="transparent" text-color="#fff" @click="handleMaxOrUnmax">
              <svg-icon type="mdi" :path="maxOrUnmaxIcon"></svg-icon>
            </var-button>
            <var-button round text color="transparent" text-color="#fff" @click="appClose">
              <svg-icon type="mdi" :path="mdiWindowClose"></svg-icon>
            </var-button>
          </div>
        </template>
      </var-app-bar>
      <div class="flex-1 overflow-hidden">
        <RouterView />
      </div>
    </div>
  </var-style-provider>
</template>