<script lang="ts" setup>
import { Game, getRealTimeGames, getRealTimeGamesSettings, waitGames, listeningRealTimeGames, initRealTimeGames } from '@/api/game';
import { getRunningDir, getSettings } from '@/api/settings'
import { exists } from '@tauri-apps/api/fs';
import { computed, Ref, ref } from 'vue';
import { _InputComponent } from '@varlet/ui';
import { open } from '@tauri-apps/api/dialog';

const value = ref(['1', '2', '3', '4'])

const settings = getSettings()

const storePathRules = [
    async (v: string) => {
        const exist = await exists(v)
        return exist ? true : '该路径不存在'
    }
]

const realTimeGames = getRealTimeGames()

const showRealTimeGames = ref(false)

const realTimeGamesSettings: Ref<Game[]> = ref([])

const filter = ref('')

const showRealTimeGamesSettings = () => {
    realTimeGamesSettings.value = getRealTimeGamesSettings()
    showRealTimeGames.value = true
}

const filterGamesSettings = computed(() => {
    const keywords = filter.value.trim();
    return realTimeGamesSettings.value.filter(it => it.title.includes(keywords))
})

const confirmRealTimeGamesSettings = () => {
    const tempGames = realTimeGamesSettings.value.filter(it => it.selected);
    const { newly, deleted } = diffGames(tempGames, realTimeGames.value)
    deleted.forEach(el => {
        waitGames.value.splice(waitGames.value.findIndex(it => it.id === el.id), 1)
        listeningRealTimeGames.value.splice(listeningRealTimeGames.value.findIndex(it => it.id === el.id), 1)
    })
    newly.forEach(el => {
        const flag = waitGames.value.some(it => it.id === el.id)
        if (!flag) waitGames.value.push(el)
    })
    settings.value.realTime.games = tempGames.map(it => it.id)
    initRealTimeGames()
}

const diffGames = (newGames: Game[], oldGames: Game[]) => {
    const newly = newGames.filter(it => !oldGames.some(el => el.id === it.id))
    const deleted = oldGames.filter(it => !newGames.some(el => el.id === it.id))
    return {
        newly,
        deleted
    }
}

const inputStorePath = ref(settings.value.realTime.storePath)
const inputStorePathRef: Ref<_InputComponent | null> = ref(null)
const handleBlur = async (_e: Event) => {
    const validate = await inputStorePathRef.value?.validate()
    if (validate) {
        settings.value.realTime.storePath = inputStorePath.value
    }
}

const selectStorePath = async () => {
    const storePath = await open({
        directory: true,
        defaultPath: await getRunningDir(),
    });
    if (!storePath) {
        return;
    }
    if (Array.isArray(storePath)) {
        Snackbar.warning("选择文件夹不正确！")
        return;
    }
    inputStorePath.value = storePath
    inputStorePathRef.value?.resetValidation()
}
</script>
<template>
    <var-collapse class="resolve-collapse" v-model="value">
        <var-collapse-item class="resolve-collapse-item" title="实时备份（开启将会为所有用户启用）" name="1">
            <var-checkbox v-model="settings.realTime.enabled">开启实时备份</var-checkbox>
        </var-collapse-item>
        <var-collapse-item class="resolve-collapse-item" title="备份路径" name="2">
            <var-input placeholder="请输入文本" v-model="inputStorePath" :rules="storePathRules" ref="inputStorePathRef"
                @blur="handleBlur">
                <template #append-icon>
                    <var-icon name="dots-vertical" class="cursor-pointer" @click="selectStorePath" />
                </template>
            </var-input>
        </var-collapse-item>
        <var-collapse-item class="resolve-collapse-item" title="提示" name="3">
            <div>
                <var-checkbox v-model="settings.realTime.startTipEnabled">
                    启动游戏时显示提示
                </var-checkbox>
            </div>
            <div>
                <var-checkbox v-model="settings.realTime.stopTipEnabled">
                    结束游戏时显示提示
                </var-checkbox>
            </div>
        </var-collapse-item>
        <var-collapse-item class="resolve-collapse-item" title="实时备份游戏" name="4">
            <div class="mb-16px">
                <var-button block type="primary" @click="showRealTimeGamesSettings">添加</var-button>
            </div>
            <template v-if="realTimeGames && realTimeGames.length > 0">
                <div class="flex flex-row flex-wrap gap-8 items-start custom-scrollbar">
                    <GameItem v-for="item in realTimeGames" :key="item.id" :game="item" show-only />
                </div>
            </template>
        </var-collapse-item>
    </var-collapse>
    <var-dialog title="添加实时备份游戏" v-model:show="showRealTimeGames" dialogClass="custom-dialog"
        @confirm="confirmRealTimeGamesSettings">
        <div class="w-[100%] h-[100%] flex flex-col">
            <var-input placeholder="请输入搜索条件" v-model="filter" />
            <div class="mt-2 flex-1 overflow-x-hidden overflow-y-auto flex flex-row flex-wrap gap-8 custom-scrollbar">
                <GameItem v-for="item in filterGamesSettings" :key="item.id" :game="item" />
            </div>
        </div>
    </var-dialog>
</template>

<style >
.custom-dialog {
    display: flex;
    flex-direction: column;
    --dialog-width: 80vw;
    height: 80vh;
    overflow: hidden;
}

.custom-dialog .var-dialog__message {
    flex: 1;
    overflow: hidden;
}
</style>