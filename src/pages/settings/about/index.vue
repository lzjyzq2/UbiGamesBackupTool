<script lang="ts" setup>
import project from '../../../../package.json'
import { open } from '@tauri-apps/api/shell';

const other = [
    'tauri',
    'serde',
    'serde_json',
    'winreg',
    'winproc',
    'thiserror',
    'auto-launch',
    'mslnk'
]
const url = "https://jq.qq.com/?_wv=1027&k=6vthnRcm"

const joinUs = async () => {
    await open(url)
}
</script>
<template>
    <div class="overflow-x-hidden overflow-y-auto h-[100%] custom-scrollbar bg-settile">
        <div class="text-2xl">
            关于UbiGamesBackupTool
        </div>
        <div class="mb-2">
            当前版本:{{ project.version }}
        </div>
        <div class="text-size-16px mb-2">
            开发者：lzjyzq2
        </div>
        <div>
            <var-button type="primary" @click="joinUs">加群反馈更多</var-button>
        </div>
        <div class="pt-2">
            <div class="text-2xl pt-2 mb-2">开源致谢：</div>
            <ul class="list-disc list-inside relative">
                <li v-for="(_value, key) in project.dependencies">
                    {{ key }}
                </li>
                <li v-for="(value, key) in project.devDependencies">
                    {{ key }}
                </li>
                <li v-for="item in other">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>
.bg-settile {
    background-image: url('@/assets/img/setTile-Studio.gif');
    @apply bg-no-repeat bg-right-bottom;
}
</style>