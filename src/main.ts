import { createApp, watch } from "vue";
// 主公共样式
import "./style.css";
// windicss
import 'virtual:windi.css'
// App
import App from "./App.vue";

// varlet 兼容浏览器
import '@varlet/touch-emulator'

// router
import router from './router'

import { initRealTimeGames } from '@/api/game'
import { getSettings } from "./api/settings";
import { startWatcher, stopWatcher } from "./api/realtimeBackup";
import { checkPermission, notify } from "./api/notification";
import { readDir } from "@tauri-apps/api/fs";
import { extname } from "@tauri-apps/api/path";

createApp(App).use(router).mount("#app");

initRealTimeGames()

const settings = getSettings()
watch(settings, () => {
    if (settings.value.realTime.enabled) {
        startWatcher()
    } else {
        stopWatcher()
    }
}, {
    immediate: true,
    deep: true
})

checkPermission()