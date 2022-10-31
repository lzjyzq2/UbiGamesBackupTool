<script lang="ts" setup>import { onMounted, ref } from 'vue';
import { isAutoStart, enableAutoStart, disableAutoStart, createDesktopLnk } from '@/api/settings'
import { checkPermission } from '@/api/notification';

const value = ref(['1', '2', '3'])

const autoStartState = ref(false)
const switchDisabled = ref(true)

onMounted(() => {
    isAutoStart().then(state => {
        autoStartState.value = state
    }).finally(() => switchDisabled.value = false)
})

const switchChange = async () => {
    try {
        switchDisabled.value = true;
        await (autoStartState.value ? disableAutoStart() : enableAutoStart());
        autoStartState.value = !autoStartState.value;
    } catch (e) {
        console.error(e)
        Snackbar.error(`设置开机启动失败${e instanceof Error ? ': ' + e.message : ''}`)
    } finally {
        switchDisabled.value = false;
    }
}
const doCreateDesktopLnk = async () => {
    createDesktopLnk().then(() => {
        Snackbar.success("创建桌面方式成功")
    }).catch(e => {
        Snackbar.error(e)
    })
}

const doCheckPermission = async () => {
    const result = await checkPermission()
    if (result) {
        Snackbar.success("已拥有通知权限")
    } else {
        Snackbar.warning("获取通知权限失败")
    }
}

</script>
<template>
    <var-collapse class="resolve-collapse" v-model="value">
        <var-collapse-item class="resolve-collapse-item" title="开机启动" name="1">
            <var-switch v-model="autoStartState" @click="switchChange" :disabled="switchDisabled" readonly />
        </var-collapse-item>
        <var-collapse-item class="resolve-collapse-item" title="桌面快捷方式" name="2">
            <var-button type="primary" @click="doCreateDesktopLnk">发送快捷方式到桌面</var-button>
        </var-collapse-item>
        <var-collapse-item class="resolve-collapse-item" title="通知权限" name="3">
            <var-button type="primary" @click="doCheckPermission">授权通知</var-button>
            <div class="opacity-70 mt-8px">
                实时备份通知需要通知权限
            </div>
        </var-collapse-item>
    </var-collapse>
</template>


<style scoped>

</style>