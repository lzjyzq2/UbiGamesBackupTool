<template>
    <svg :width="sizeValue" :height="sizeValue" :viewBox="viewboxValue" :style="styles">
        <path :d="path" />
    </svg>
</template>

<script lang="ts">
export enum Flip {
    horizontal = 'horizontal',
    vertical = 'vertical',
    both = 'both',
    none = 'none'
}
</script>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';

export interface Props {
    type: string,
    path: string,
    size: string | number,
    viewbox?: string,
    flip?: Flip,
    rotate: number
}

const props = withDefaults(defineProps<Props>(), {
    type: 'default',
    size: 24,
    rotate: 0
})
const {
    type,
    path,
    size,
    viewbox,
    flip,
    rotate
} = toRefs(props)

const types: {
    [key: string]: {
        size: number,
        viewbox: string
    }
} = {
    mdi: {
        size: 24,
        viewbox: "0 0 24 24",
    },
    "simple-icons": {
        size: 24,
        viewbox: "0 0 24 24",
    },
    default: {
        size: 0,
        viewbox: "0 0 0 0",
    },
}

const styles = computed(() => {
    return {
        "--sx": [Flip.both, Flip.horizontal].includes(flip?.value ?? Flip.none) ? "-1" : "1",
        "--sy": [Flip.both, Flip.vertical].includes(flip?.value ?? Flip.none) ? "-1" : "1",
        "--r": isNaN(rotate.value) ? rotate.value : rotate.value + "deg",
    }
})

const defaults = computed(() => {
    return types[type?.value] || types.default
})


const sizeValue = computed(() => {
    return size.value || defaults.value.size
})

const viewboxValue = computed(() => {
    return viewbox?.value || defaults.value.viewbox
})
</script>

<style scoped>
svg {
    transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
}

path {
    fill: currentColor;
}
</style>
