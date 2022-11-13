import { readonly, ref } from "vue";

const title = ref('UbiGamesBackupTool')


export const setTitle = (newTile: string) => {
    title.value = newTile
}

export const getTitle = () => {
    return readonly(title)
}

export default {
    setTitle,
    getTitle
}