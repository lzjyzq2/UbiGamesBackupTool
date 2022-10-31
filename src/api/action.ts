import { ref, readonly } from "vue"

const isFold = ref(true)
export const fold = readonly(isFold)


export const toggleAction = () => {
    isFold.value = !isFold.value
    return fold
}

export const setFold = (status: boolean) => {
    isFold.value = status
}

export const getFold = () => {
    return fold.value
}

export default {
    toggleAction,
    fold,
    setFold,
    getFold
}