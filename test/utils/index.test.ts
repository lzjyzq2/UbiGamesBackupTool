import { expect, test } from 'vitest'
import { User } from '../../src/api/user'
import { asyncFilter, asyncMap } from '../../src/utils'

test('asyncFilter', async () => {
    const users: User[] = [{
        key: '1',
    }, {
        key: '2'
    }, {
        key: '3'
    }, {
        key: '4'
    },]

    const filterUsers = await asyncFilter(users, async it => parseInt(it.key ?? '-1') > 2)
    filterUsers.forEach(user => {
        expect(parseInt(user.key ?? '-1')).toBeGreaterThan(2)
    })
    console.log(filterUsers)
})

test('asyncMap', async () => {
    const users: User[] = [{
        key: '1',
    }, {
        key: '2'
    }, {
        key: '3'
    }, {
        key: '4'
    },]

    const filterUids = await asyncFilter(users, async it => parseInt(it.key ?? '-1') > 2).then(users => asyncMap(users, async (it) => it.key))
    filterUids.forEach(key => {
        expect(parseInt(key ?? '-1')).toBeGreaterThan(2)
    })
    console.log(filterUids)
})