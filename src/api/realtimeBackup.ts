import { waitGames, listeningRealTimeGames, initWaitGames } from "./game"
import { notify } from "./notification";
import { getAllProcess, Proc } from "./proc";
import { getSettings } from "./settings";
import { backupRealTimeGames } from "./ubi";

let watcher: number | null = null;
let watching = false

export const startWatcher = () => {
    if (!watcher) {
        console.log('startWatcher')
        initWaitGames()
        whileCheck()
    }
}

const whileCheck = async () => {
    await check()
    watcher = setTimeout(() => {
        whileCheck()
    }, 5000)
}

export const stopWatcher = () => {
    if (watcher) {
        console.log('stopWatcher')
        clearTimeout(watcher)
        watcher = null
    }
}

const check = async () => {
    if (watching) {
        return
    }
    console.log('watching')
    watching = true
    const { procs } = await getAllProcess()
    const running = checkRunningGames(procs)
    const stop = checkStopGames(procs)
    const {
        storePath,
        startTipEnabled,
        stopTipEnabled
    } = getSettings().value.realTime
    console.log('running', running, 'stop', stop)
    if (running.length > 0 && startTipEnabled) {
        listeningRealTimeGames.value.push(...running)
        notify("实时备份", `[${running.map(it => it.title + ' - ' + it.platform).join(',')}]正在运行`)
    }
    if (stop.length > 0) {
        await backupRealTimeGames(storePath, stop)
            .then(() => {
                if (stopTipEnabled) {
                    notify("实时备份", `[${stop.map(it => it.title + ' - ' + it.platform).join(',')}]备份成功`)
                }
            }).catch((e) => {
                console.log(e)
                if (stopTipEnabled) {
                    notify("实时备份", `[${stop.map(it => it.title + ' - ' + it.platform).join(',')}]备份失败`)
                }
            })
        stop.forEach(it => {
            const idx = listeningRealTimeGames.value.findIndex(el => el.id === it.id)
            if (idx > -1) {
                listeningRealTimeGames.value.splice(idx, 1)
            }
        })
        waitGames.value.push(...stop)
    }
    watching = false
    console.log(waitGames.value, listeningRealTimeGames.value)
}


const checkRunningGames = (procs: Proc[]) => {
    console.log(waitGames.value)
    const running = []
    for (const proc of procs) {
        let _idx = 0
        for (; _idx < waitGames.value.length; _idx++) {
            console.log(proc.name, waitGames.value[_idx].appname)
            if (proc.name === waitGames.value[_idx].appname) {
                running.push(...waitGames.value.splice(_idx, 1))
                _idx--
            }
        }
    }
    return running;
}

const checkStopGames = (procs: Proc[]) => {
    const stop = listeningRealTimeGames.value.filter((it) => {
        return !(procs.some(el => el.name === it.appname))
    })
    return stop
}