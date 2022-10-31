import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { readonly, ref } from 'vue';

const _permissionGranted = ref(false)
export const permissionGranted = readonly(_permissionGranted)

export const checkPermission = async () => {
    _permissionGranted.value = await isPermissionGranted();
    if (!_permissionGranted.value) {
        const permission = await requestPermission();
        _permissionGranted.value = permission === 'granted';
    }
    return _permissionGranted.value;
}

export const notify = async (title: string, content: string) => {
    sendNotification({ title, body: content });
}