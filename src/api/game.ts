import gamelist from '@/assets/games.json'
import { asyncFilter, asyncMap, deepClone, uuid } from '@/utils';
import { exists, readDir, readTextFile } from '@tauri-apps/api/fs';
import { resolve, sep } from '@tauri-apps/api/path';
import { getUserPicturePath } from './ubi';
import { getCurrentUser, User } from './user';
import { getSettings } from './settings';
import { Ref, ref } from 'vue';
import { convertFileSrc } from "@tauri-apps/api/tauri";

export interface Game {
    id: number;
    name: string;
    title: string;
    platform: string;
    picture?: string;
    appname?: string;
    process?: string;
    img?: string;
    selected?: boolean;
}

const games = Object.freeze(gamelist);
export const realTimeGames: Ref<Game[]> = ref([])
export const waitGames: Ref<Game[]> = ref([])
export const listeningRealTimeGames: Ref<Game[]> = ref([])

export const getGameList = () => {
    return games;
}

export const getSaveGameIds = async (path: string) => {
    const dirs = await readDir(path, { recursive: false })
    const gameIds = dirs.filter(dir => dir.children !== null && dir.name).map(it => parseInt(it.name ?? ''))
    return gameIds
}

export const loadSaveGames = async (): Promise<Array<Game>> => {
    const currentUser = getCurrentUser()?.value;
    if (currentUser == null || !currentUser.savegame) {
        return []
    }
    const flag = await exists(currentUser.savegame);
    if (!flag) {
        return []
    }

    return loadGames(currentUser.savegame)
}

const loadGames = async (path: string): Promise<Game[]> => {
    const gameIds = await getSaveGameIds(path);
    const savegames = games.filter(game => gameIds.includes(game.id)).map(it => deepClone(it))
    return savegames;
}

export const loadRestoreGames = async (restorePath: string) => {
    return loadGames(restorePath)
}

export const loadRestoreUsers = async (restorePath: string) => {
    const exist = await exists(restorePath)
    if (!exist) {
        return Promise.reject('还原文件夹不存在')
    }
    const hasBackInfo = await checkHasBackInfo(restorePath)
    if (hasBackInfo) {
        restorePath = await resolve(restorePath, '..')
    }
    const dirs = await readDir(restorePath, { recursive: false })
    try {
        const avatarsPath = await getUserPicturePath()
        return asyncFilter(dirs, async it => checkHasBackInfo(it.path))
            .then(dirs => asyncMap(dirs, async it => {
                const backinfo = await resolve(it.path, 'backinfo.json')
                const user: User = JSON.parse(await readTextFile(backinfo))
                user.key = user.key ? user.key : uuid()
                user.picture = convertFileSrc(`${avatarsPath}${user.uuid}_64.png`)
                user.savegame = `${it.path}${sep}`
                return user
            }))
    } catch (e) {
        return Promise.reject(e)
    }
}

export const checkHasBackInfo = async (path: string) => {
    const content = await readDir(path, { recursive: false })
    return content.some(it => it.name === 'backinfo.json')
}

export const getSupportRealTimeGames = () => {
    return games.filter(it => it.appname).map(it => deepClone(it))
}

const _getRealTimeGames = () => {
    const settings = getSettings()
    return (getSupportRealTimeGames() as Game[])
        .filter(it => settings.value.realTime.games?.includes(it.id))
}

export const getRealTimeGames = () => {
    return realTimeGames
}

export const initRealTimeGames = () => {
    realTimeGames.value = _getRealTimeGames()
    return realTimeGames
}

export const getRealTimeGamesSettings = () => {
    const settings = getSettings()
    return (getSupportRealTimeGames() as Game[])
        .map(it => {
            it.selected = settings.value.realTime.games?.includes(it.id)
            return it
        })
}

export const initWaitGames = () => {
    waitGames.value = deepClone(realTimeGames.value)
}