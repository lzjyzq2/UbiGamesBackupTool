import { Ref, ref } from "vue";

export enum Mode {
    backup,
    restore
}

export const currentMode: Ref<Mode | null> = ref(null)