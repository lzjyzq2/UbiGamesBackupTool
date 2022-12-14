import { Component, DefineComponent, readonly, ref, markRaw, shallowRef } from "vue";
import General from '@/pages/settings/general/index.vue'
import RealTime from '@/pages/settings/real-time/index.vue'
import About from '@/pages/settings/about/index.vue'
import UserSettings from '@/pages/settings/user-settings/index.vue'
import { RouteComponent } from "vue-router";


export interface SettingsComponent {
    name: string;
    label: string;
    component: RouteComponent | Promise<RouteComponent>;
    icon: string;
}

export const settingsComponents: Array<SettingsComponent> = [{
    name: 'general',
    label: '综合',
    component: General,
    icon: 'wrench'
}, {
    name: 'realtime',
    label: '实时备份',
    component: RealTime,
    icon: 'format-list-checkbox'
},{
    name: 'user-settings',
    label: '用户设置',
    component: UserSettings,
    icon: 'account-circle-outline'
}, {
    name: 'about',
    label: '关于',
    component: About,
    icon: 'information-outline'
}]

const currentComponent = shallowRef(settingsComponents[0])


export const setCurrentComponent = (component: SettingsComponent) => {
    currentComponent.value = component;
}

export const getCurrentComponent = () => {
    return currentComponent
}