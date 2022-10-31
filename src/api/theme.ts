import { Themes } from '@varlet/ui'
import { readonly, ref } from 'vue';

export const customTheme = {
    '--action-bg-color': "#3f51b5",
    "--action-group-bg-color": "#6975b5",
    "--top-hint-panel-bg-color":"#6975b5",
    "--game-panel-bg-color":"#6975b5",
    "--filter-input-bg-color":"#545e91",
}
export const customThemeDark = {
    ...Themes.dark,
    '--action-bg-color': "#3f51b5",
    "--action-group-bg-color": "#3f51b5",
    "--top-hint-panel-bg-color":"#3f51b5",
    "--game-panel-bg-color":"#6975b5",
    "--filter-input-bg-color":"#6975b5",
}

export const currentTheme = ref(customTheme);

const isDarkFlag = ref(false)

export const toggleTheme = () => {
    isDarkFlag.value = !isDarkFlag.value
    currentTheme.value = isDarkFlag.value ? customThemeDark : customTheme
}
export const isDark = readonly(isDarkFlag)

export default {
    currentTheme,
    customTheme,
    customThemeDark,
    toggleTheme,
    isDark
}