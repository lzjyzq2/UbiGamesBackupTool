<script lang="ts" setup>
import { Game, loadRestoreGames, loadRestoreUsers } from '@/api/game'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { open } from '@tauri-apps/api/dialog'
import { chooseUser, getCurrentUser, setUsers, getAllUsers, User } from '@/api/user';
import dayjs from 'dayjs';
import { wait } from '@/utils';
import { restoreGames } from '@/api/ubi';
import { currentMode, Mode } from '@/pages/home/services'
import { getSettings } from '@/api/settings';

const value = ref('')
const games: Ref<Array<Game> | null> = ref(null)
const currentUser = getCurrentUser()
const allUsers = getAllUsers()

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
const showChooseRestore = computed(() => !currentUser.value && (!games.value || games.value.length == 0))
const toLoadRestoreUsers = async () => {
    const restorePath = await open({
        directory: true,
        defaultPath: getSettings().value.realTime.storePath,
    });
    if (!restorePath) {
        return;
    }
    if (Array.isArray(restorePath)) {
        Snackbar.warning("选择文件夹不正确！")
        return;
    }
    const users = await loadRestoreUsers(restorePath)
    setUsers(users)
    if (users.length > 0) {
        chooseUser(users[0])
    }
}
const hintText = computed(() => {
    if (allUsers.value.length == 0) {
        return '请选择备份文件夹进行还原'
    }
    if (currentUser.value) {
        return `由${currentUser.value.username || currentUser.value.uuid}在${dayjs(currentUser.value.storeTime).format('YYYY-MM-DD HH:mm:ss')}备份`
    } else {
        return '请在左侧选择一个备份记录进行还原'
    }
})

const doRestoreGames = async () => {
    const confirm = await Dialog('是否确认进行还原？')
    if (confirm !== 'confirm') {
        return
    }
    if (!currentUser.value) {
        return
    }
    if (!games.value || games.value.length === 0) {
        return
    }
    const tempGames = games.value.filter(it => it.selected)
    if (tempGames.length === 0) {
        return
    }
    restoreLoading.value = true
    wait(restoreGames(currentUser.value, tempGames), 1000)
        .then((res) => {
            restoreFailGames.value = res.fail
            restoreSuccessGames.value = res.success
            finishDialogShow.value = true
            Snackbar.success("还原完成！")
        }).catch((e) => {
            console.log(e)
            Snackbar.error(e)
        }).finally(() => {
            restoreLoading.value = false
        })
}

onMounted(() => {
    if (currentMode.value !== Mode.restore) {
        setUsers([])
        chooseUser(null)
    } else {
        if (!games.value || games.value.length === 0) {
            _loadRestoreGames(currentUser.value)
        }
    }
    currentMode.value = Mode.restore
})


const _loadRestoreGames = async (user: User | null) => {
    if (user && user.savegame) {
        const restoreGames = await loadRestoreGames(user.savegame)
        if (user.games && user.games.length > 0) {
            games.value = restoreGames.filter(it => user.games?.includes(it.id))
        } else {
            games.value = restoreGames
        }
    }
}

watch(currentUser, async (user) => {
    _loadRestoreGames(user)
})

const restoreLoading = ref(false)

const closeLoading = () => {
    restoreLoading.value = false
}

const finishDialogShow = ref(false)
const restoreFailGames: Ref<Game[] | null> = ref(null)
const restoreSuccessGames: Ref<Game[] | null> = ref(null)
</script>

<template>
    <div class="backup-panel">
        <div class="top-hint-panel">
            {{ hintText }}
        </div>
        <div class="tool-panel">
            <div class="flex-1 bg-$game-panel-bg-color h-[100%] flex items-center p-8px rounded-md">
                <FilterInput class="w-[100%]" placeholder="请输入筛选游戏名" v-model:value="value" />
            </div>
            <div style="height: 100%;"
                class="bg-$game-panel-bg-color px-8px rounded-md flex flex-row gap-8px items-center">
                <var-button @click="toLoadRestoreUsers">
                    <var-icon name="refresh" />重选
                </var-button>
                <var-button @click="selectAllGames(isAllSelected)">
                    <var-icon :name="allSelectedIconName" /> {{ allSelectedText }}
                </var-button>
                <var-button type="primary" @click="doRestoreGames">
                    <var-icon name="upload" />还原
                </var-button>
            </div>
        </div>
        <div class="game-panel custom-scrollbar">
            <template v-if="filterGames && filterGames.length > 0">
                <GameItem v-for="item in filterGames" :key="item.id" :game="item" />
            </template>
            <template v-else-if="showChooseRestore">
                <div class="h-[100%] w-[100%] flex items-center justify-center">
                    <var-button type="primary" @click="toLoadRestoreUsers">
                        选择备份文件夹开始还原
                    </var-button>
                </div>
            </template>
        </div>
    </div>

    <var-popup v-model:show="restoreLoading" :close-on-click-overlay="false" @dblclick="closeLoading">
        <div class="bg-white w-120px flex flex-col items-center justify-center">
            <div class="py-16px">
                <var-loading type="disappear" />
            </div>
            <div class="pb-16px text-size-12px opacity-70 select-none">
                双击关闭
            </div>
        </div>
    </var-popup>

    <var-dialog v-model:show="finishDialogShow" :cancel-button="false">
        <div>
            还原成功{{ restoreSuccessGames?.length ?? 0 }}个游戏，失败{{ restoreFailGames?.length ?? 0 }}个游戏，
        </div>
        <ul v-if="restoreFailGames && restoreFailGames.length > 0">
            还原失败游戏(已存在存档)：
            <li v-for="item in restoreFailGames">
                {{ item.title }}-{{ item.platform }}
            </li>
        </ul>
    </var-dialog>
</template>
<style scoped>
.backup-panel {
    @apply h-[100%] flex-1 overflow-hidden flex flex-col;
}

.backup-panel .top-hint-panel {
    @apply h-[30px] w-[100%] bg-$top-hint-panel-bg-color rounded-md flex items-center justify-center text-white mb-8px;
}

.backup-panel .game-panel {
    @apply flex-1 flex flex-row flex-wrap content-start gap-8px overflow-x-hidden overflow-y-auto p-16px bg-$game-panel-bg-color rounded-t-md;
}

.backup-panel .game-panel .game {}

.tool-panel {
    @apply h-[48px] w-[100%] flex flex-row gap-8px mb-8px rounded-md items-center;
}
</style>