<script lang="ts" setup>
import { loadSaveGames, Game } from '@/api/game'
import { ref, watch, Ref, computed, onMounted } from 'vue';
import GameItem from '../../../components/GameItem.vue'
import FilterInput from '../../../components/FilterInput.vue'
import { getCurrentUser, User, initAllUsers, chooseUser } from '@/api/user';
import { open } from '@tauri-apps/api/dialog'
import { appDir } from '@tauri-apps/api/path';
import { backupGames } from '@/api/ubi'
import { wait } from '@/utils'
import { currentMode, Mode } from '../services';

const games: Ref<Array<Game> | null> = ref(null)

const value = ref('')

const currentUser = getCurrentUser()

onMounted(() => {
    if (currentMode.value !== Mode.backup) {
        initAllUsers().then((users) => {
            if (users.length > 0) {
                chooseUser(users[0])
            }
        })
    }
    currentMode.value = Mode.backup
})

watch(currentUser, async (user) => {
    if (user !== null) {
        games.value = await loadSaveGames()
    }
}, {
    immediate: true
})


const filterGames = computed(() => {
    const filter = value.value?.trim()
    if (filter) {
        return games.value?.filter(it => it.title.includes(filter))
    } else {
        return games.value
    }
})
const isAllSelected = computed(() => filterGames.value?.some(it => !it.selected) ?? true)
const allSelectedIconName = computed(() => isAllSelected.value ? 'checkbox-blank-outline' : 'checkbox-marked-outline')
const allSelectedText = computed(() => isAllSelected.value ? '全选' : '取消')

const selectAllGames = (selected: boolean) => {
    filterGames.value?.forEach(it => it.selected = selected)
}

const toBackupGames = async () => {
    const confirm = await Dialog('是否确认进行备份？')
    if (confirm !== 'confirm') {
        return
    }
    if (!currentUser.value) {
        Snackbar.warning("尚未选择用户！")
        return;
    }
    const bkGames = games.value?.filter(it => it.selected);
    if (!bkGames || bkGames.length === 0) {
        Snackbar.warning("尚未选择备份游戏！")
        return
    }

    const savePath = await open({
        directory: true,
        defaultPath: await appDir(),
    });
    if (!savePath || Array.isArray(savePath)) {
        return;
    }
    backupLoading.value = true
    wait(backupGames(savePath, currentUser.value, bkGames), 1000)
        .then(() => {
            Snackbar.success("备份完成！")
        }).catch((e) => {
            Snackbar.error(e)
        }).finally(() => {
            backupLoading.value = false
        })
}

const backupLoading = ref(false)

const closeLoading = () => {
    backupLoading.value = false
}
</script>

<template>
    <div class="backup-panel">
        <div class="top-hint-panel">
            请选择备份游戏
        </div>
        <div class="tool-panel">
            <div class="flex-1 bg-$game-panel-bg-color h-[100%] flex items-center p-8px rounded-md">
                <FilterInput class="w-[100%]" placeholder="请输入筛选游戏名" v-model:value="value" />
            </div>
            <div style="height: 100%;"
                class="bg-$game-panel-bg-color px-8px rounded-md flex flex-row gap-8px items-center">
                <var-button @click="selectAllGames(isAllSelected)">
                    <var-icon :name="allSelectedIconName" /> {{ allSelectedText }}
                </var-button>
                <var-button type="primary" @click="toBackupGames">
                    <var-icon name="download" />备份
                </var-button>
            </div>
        </div>
        <div class="game-panel">
            <template v-if="filterGames && filterGames.length > 0">
                <GameItem v-for="item in filterGames" :key="item.id" :game="item" />
            </template>
            <template v-else>

            </template>
        </div>
    </div>

    <var-popup v-model:show="backupLoading" :close-on-click-overlay="false" @dblclick="closeLoading">
        <div class="bg-white w-120px flex flex-col items-center justify-center">
            <div class="py-16px">
                <var-loading type="disappear" />
            </div>
            <div class="pb-16px text-size-12px opacity-70 select-none">
                双击关闭
            </div>
        </div>
    </var-popup>
</template>
<style scoped>
.backup-panel {
    @apply h-[100%] flex-1 overflow-hidden flex flex-col;
}

.backup-panel .top-hint-panel {
    @apply h-[48px] w-[100%] bg-$top-hint-panel-bg-color rounded-b-md flex items-center justify-center text-white mb-8px;
}

.backup-panel .game-panel {
    @apply flex-1 flex flex-row flex-wrap gap-8px overflow-x-hidden overflow-y-auto p-16px bg-$game-panel-bg-color rounded-t-md;
}

.backup-panel .game-panel .game {}

.tool-panel {
    @apply h-[48px] w-[100%] flex flex-row gap-8px mb-8px rounded-md items-center;
}
</style>