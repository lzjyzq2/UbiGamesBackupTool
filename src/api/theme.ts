import { Themes } from '@varlet/ui'
import { readonly, ref } from 'vue';

export const customTheme = {
    '--home-bg-color': '#f5f5f5',
    '--action-bg-color': "#40a9ff",
    "--action-group-bg-color": "#1890ff",
    '--toggle-mode-active-color': '#0079e8',
    "--top-hint-panel-bg-color": "#1890ff",
    "--game-panel-bg-color": "#ebebeb",
    '--game-item-title-color': '#141414',
    '--game-item-bg-color': '#bfbfbf',
    '--game-item-title-bg-color': '#f5f5f5',
    '--game-empty-color': '#434343',
    "--filter-input-bg-color": "#cfcfcf",
    "--scrollbar-thumb-color": "#cfcfcf"
}
export const customThemeDark = {
    ...Themes.dark,
    '--home-bg-color': '#141414',
    '--action-bg-color': "#434343",
    "--action-group-bg-color": "#262626",
    '--toggle-mode-active-color': '#1c1a1a',
    "--top-hint-panel-bg-color": "#262626",
    "--game-panel-bg-color": "#262626",
    '--game-item-title-color': '#f5f5f5',
    '--game-item-bg-color': '#141414',
    '--game-item-title-bg-color': '#434343',
    '--game-empty-color': '#434343',
    "--filter-input-bg-color": "#434343",
    "--scrollbar-thumb-color": "#dfe4ea"
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