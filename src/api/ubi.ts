import { isBlank } from '@/utils'
import { invoke } from '@tauri-apps/api/tauri'
import { extname, resolve, sep } from '@tauri-apps/api/path';
import { getAllUsers, initAllUsers, User } from './user';
import { Game } from './game';
import { copyFile, createDir, exists, readDir, removeDir, writeTextFile } from '@tauri-apps/api/fs';
import dayjs from 'dayjs'

let installPath: string | null = null;

export const getRegistryValue = async () => {
    return invoke<string>('get_registry')
}

export const getInstallPath = async () => {
    if (installPath) {
        return installPath
    } else {
        const command = await getRegistryValue()
        if (!isBlank(command)) {
            const paths = command.split('"')
            if (paths.length > 2) {
                installPath = paths[1].substring(0, command.lastIndexOf('\\'))
                return installPath;
            }
        }
    }
    return Promise.reject('Not found install path')
}

export const getSavegamesPath = async () => {
    const installPath = await getInstallPath()
    if (!isBlank(installPath)) {
        return `${installPath}savegames${sep}`
    }
    return Promise.reject('Not found savegame path')
}

export const getUserPicturePath = async () => {
    const installPath = await getInstallPath()
    if (!isBlank(installPath)) {
        return `${installPath}cache${sep}avatars${sep}`
    }
    return Promise.reject('Not found user avatars path')
}

const getBackupRootPath = async (backupPath: string) => {
    const templatePath = await resolve(backupPath, `ubigamebak-${dayjs().format('YYYY-MM-DD')}`)
    let rootPath = templatePath
    let flag = false;
    for (let index = 1; index <= 10; index++) {
        flag = await exists(rootPath)
        if (!flag) {
            return rootPath + sep
        } else {
            rootPath = `${templatePath}-${index}`
        }
    }
    return Promise.reject('无法创建备份目录！');
}

const copyDir = async (source: string, dest: string) => {
    const exist = await exists(dest)
    if (!exist) {
        createDir(dest, { recursive: true })
    }
    const dirs = await readDir(source, { recursive: false });
    for (const dir of dirs) {
        if (dir.name) {
            const destFile = await resolve(dest, dir.name)
            if (dir.children && dir.name) {
                await copyDir(dir.path, destFile)
            } else {
                const ext = await extname(dir.name ?? '')
                if (!(ext === 'z' || ext === 'upload')) {
                    await copyFile(dir.path, destFile)
                }
            }
        }
    }
}

export const backupGames = async (backupPath: string, user: User, games: Array<Game>) => {
    const rootPath = await getBackupRootPath(backupPath)
    await createDir(rootPath, { recursive: true }).catch(() => Promise.reject("创建备份目录失败！"));
    try {
        for (const game of games) {
            const savegamePath = `${user.savegame}${game.id}`
            const backupGamePath = `${rootPath}${game.id}`
            await copyDir(savegamePath, backupGamePath)
        }
        outputBackupInfo(rootPath, user, games)
    } catch (e) {
        console.log(e)
        await removeDir(rootPath).catch(() => "")
        return Promise.reject('拷贝存档失败！')
    }
}

const outputBackupInfo = async (rootPath: string, user: User, games: Array<Game>) => {
    const backupInfo = {
        uuid: user.uuid,
        username: user.username,
        savegame: rootPath,
        games: games.map(it => it.id),
        storeTime: new Date().getTime()
    }
    const backupInfoFilePath = await resolve(rootPath, 'backinfo.json')
    await writeTextFile(backupInfoFilePath, JSON.stringify(backupInfo))
}

export const restoreGames = async (user: User, games: Game[]) => {
    const savegamesPath = await getSavegamesPath();
    const restorePath = `${savegamesPath}${user.uuid}${sep}`
    if (isBlank(user.savegame)) {
        return Promise.reject(new Error("无备份路径"))
    }
    const success = [], fail = []
    try {
        for (const game of games) {
            const savegamePath = `${restorePath}${game.id}`
            const backupGamePath = `${user.savegame}${game.id}`
            const exist = await exists(savegamePath)
            if (!exist) {
                await copyDir(backupGamePath, savegamePath)
                success.push(game)
            } else {
                fail.push(game)
            }
        }
        return { success, fail }
    } catch (e) {
        await removeGames(user, success)
        return Promise.reject(e)
    }
}

const removeGames = async (user: User, games: Game[]) => {
    const savegamesPath = await getSavegamesPath();
    const usersavePath = `${savegamesPath}${user.uuid}${sep}`
    for (const game of games) {
        const savegamePath = `${usersavePath}${game.id}`
        removeDir(savegamePath).catch(e => console.log(e))
    }
}

export const backupRealTimeGames = async (realTimeBackupPath: string, backupGames: Game[]) => {
    if(backupGames.length>0){
        return Promise.reject('没有需要备份的游戏')
    }
    let rootPath = null;
    try {
        const users = getAllUsers()
        if (users.value.length === 0) {
            await initAllUsers()
        }
        if (users.value.length === 0) {
            return Promise.reject('没有用户需要备份')
        }
        console.log(users, 'users')
        for (const user of users.value) {
            const outGames: Game[] = []
            rootPath = await resolve(realTimeBackupPath, dayjs().format("YYYYMMDDHHmmss") + '-' + user.uuid)
            console.log(rootPath, 'rootPath')
            await createDir(rootPath, { recursive: true }).catch(() => Promise.reject("创建备份目录失败！"));
            for (const game of backupGames) {
                const savegamePath = `${user.savegame}${game.id}`
                const backupGamePath = await resolve(rootPath, game.id + '')
                const exist = await exists(savegamePath)
                if (exist) {
                    await copyDir(savegamePath, backupGamePath)
                    outGames.push(game)
                }
            }
            outputBackupInfo(rootPath, user, outGames)
        }
    } catch (e) {
        console.log(e)
        if (rootPath) {
            await removeDir(rootPath).catch(() => "")
        }
        return Promise.reject('拷贝存档失败！')
    }
}
