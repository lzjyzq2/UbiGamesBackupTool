import { readonly, ref, Ref } from "vue"
import { readDir } from '@tauri-apps/api/fs';
import { getInstallPath, getSavegamesPath, getUserPicturePath } from "./ubi";
import { sep } from "@tauri-apps/api/path";
import { uuid } from "@/utils";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const getAllUserIds = async (): Promise<Array<string>> => {
    const savegamePath = await getSavegamesPath()
    const dirs = await readDir(savegamePath, { recursive: false })
    const userIds = dirs.filter(dir => dir.children !== null).map(it => it.name ?? '')
    return userIds
}

const currentUser: Ref<User | null> = ref(null)

export interface User {
    key: string,
    uuid?: string;
    username?: string;
    picture?: string;
    savegame?: string;
    games?: number[];
    storeTime?: number;
}

export const chooseUser = (user: User | null) => {
    currentUser.value = user;
}

export const getCurrentUser = () => {
    return currentUser
}

const users: Ref<Array<User>> = ref([])

export const initAllUsers = async (): Promise<Array<User>> => {
    const userIds = await getAllUserIds()
    const avatarsPath = await getUserPicturePath()
    const savegamesPath = await getSavegamesPath();
    const userlist = userIds.map(id => ({
        key: uuid(),
        uuid: id,
        username: '',
        picture: convertFileSrc(`${avatarsPath}${id}_64.png`),
        savegame: `${savegamesPath}${id}${sep}`
    }))
    users.value = userlist
    return userlist;
}


export const getAllUsers = () => {
    return users
}

export const setUsers = (tempUsers: Array<User>) => {
    users.value = tempUsers
}