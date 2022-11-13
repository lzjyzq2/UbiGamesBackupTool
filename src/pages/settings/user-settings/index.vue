<script lang="ts" setup>
import { getAllUsers, initAllUsers, User } from './../../../api/user';
import { getSettings } from '../../../api/settings';
import usericon from '../../../assets/img/user.png';
import { isBlank } from '../../../utils'
import { onMounted, Ref, ref } from 'vue';

const settings = getSettings()

const users: Ref<User[] | null> = ref(null)

const show = ref(false)

const editUser: Ref<User | null> = ref(null)
const editUsername: Ref<string> = ref('')

onMounted(() => {
    const tempUsers = getAllUsers().value
    if (!tempUsers || tempUsers.length === 0) {
        initAllUsers().then(allUsers => {
            users.value = allUsers
        })
    } else {
        users.value = tempUsers
    }
})

const displayUsername = (username?: string) => {
    return isBlank(username) ? '未设置' : username
}

const showEditDialog = (user: User) => {
    editUser.value = user
    editUsername.value = user.username ?? ''
    show.value = true
}

const confirmEdit = () => {
    if (editUser.value) {
        editUser.value.username = editUsername.value ?? ''
        if (editUser.value.uuid) {
            console.log(editUser.value.uuid, settings.value.users)
            if (settings.value.users) {
                settings.value.users[editUser.value.uuid] = editUsername.value ?? ''
            } else {
                settings.value.users = { [editUser.value.uuid]: editUsername.value ?? '' }
            }

        }
        closedEditDialog()
    } else {
        Snackbar.warning('设置失败')
    }
}

const closedEditDialog = () => {
    show.value = false
    editUser.value = null
    editUsername.value = ''
}
</script>

<template>
    <var-table>
        <thead>
            <tr>
                <th scope="col">头像</th>
                <th scope="col">用户ID</th>
                <th scope="col">用户名</th>
                <th scope="col">设置</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users">
                <td>
                    <var-image :src="user.picture" :error="usericon" lazy :radius="999" width="30" height="30"
                        fit="fill" />
                </td>
                <td>{{ user.uuid }}</td>
                <td>{{ displayUsername(user.username) }}</td>
                <td>
                    <var-button text type="primary" @click="showEditDialog(user)">设置</var-button>
                </td>
            </tr>
        </tbody>
    </var-table>

    <var-dialog v-model:show="show" title="设置用户名" @closed="closedEditDialog" @confirm="confirmEdit"
        dialogClass="user-custom-dialog">
        <div class="flex flex-row items-center">
            <var-image :src="editUser?.picture" :error="usericon" lazy :radius="999" width="30" height="30"
                fit="fill" />
            <span class="whitespace-nowrap ml-2">{{ editUser?.uuid }}</span>
        </div>
        <var-input placeholder="请输入用户名" v-model="editUsername" />
    </var-dialog>
</template>

<style>
.user-custom-dialog {
    --dialog-width: 400px;
}
</style>