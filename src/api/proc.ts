import { invoke } from "@tauri-apps/api/tauri";


export interface ProcList {
    procs: Proc[]
}

export interface Proc {
    name: string;
    path: string;
}

export const getAllProcess = async (): Promise<ProcList> => {
    return invoke('get_all_process')
}