import { useStorage } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/tauri'
import { isBlank } from '@/utils'
import { resolve } from '@tauri-apps/api/path'
import { createDir, exists } from '@tauri-apps/api/fs'

const settings = useStorage('settings', {
    realTime: {
        enabled: false,
        storePath: '',
        startTipEnabled: true,
        stopTipEnabled: true,
        games: new Array<number>()
    },
})

const initRealTimeStorePath = async () => {
    if (isBlank(settings.value.realTime.storePath)) {
        const runningDir = await getRunningDir()
        const realTimeStorePath = await resolve(runningDir, 'realtime')
        const exist = await exists(realTimeStorePath)
        if (!exist) {
            await createDir(realTimeStorePath, { recursive: true })
        }
        settings.value.realTime.storePath = realTimeStorePath
    }
}

initRealTimeStorePath()

export const getSettings = () => {
    return settings;
}

export async function isAutoStart(): Promise<boolean> {
    return invoke('plugin:autostart|is_enabled')
}

export async function enableAutoStart(): Promise<void> {
    await invoke('plugin:autostart|enable')
}

export async function disableAutoStart(): Promise<void> {
    await invoke('plugin:autostart|disable')
}

export async function getRunningDir(): Promise<string> {
    return invoke('get_running_dir')
}

export async function createDesktopLnk(): Promise<void> {
    return invoke('create_desktop_lnk')
}

