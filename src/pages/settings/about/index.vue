<script lang="ts" setup>
import project from '../../../../package.json'

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
</script>
<template>
    <div>
        <div>
            关于UbiGamesBackupTool
        </div>
        <div>
            当前版本:{{project.version}}
        </div>
        <div>
            开发者：lzjyzq2
        </div>
        <div>
            <var-button type="primary">加群反馈更多</var-button>
        </div>
        <div>
            <div>开源致谢：</div>
            <ul>
                <li v-for="(value,key) in project.dependencies">
                    {{key}}
                </li>
                <li v-for="(value,key) in project.devDependencies">
                    {{key}}
                </li>
                <li v-for="item in other">
                    {{item}}
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>

</style>