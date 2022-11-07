<script lang="ts" setup>
import { Game } from '@/api/game'
import { toRefs } from 'vue';
import failImgPath from '@/assets/img/gamepad-variant-outline.svg'

export interface Props {
    game: Game,
    showOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showOnly: false
})

const {
    game,
    showOnly
} = toRefs(props)
</script>

<template>
    <div class="game bg-$game-item-bg-color">
        <var-image :src="'/image/games/' + game.picture" :error="failImgPath" lazy class="rounded-md" width="300" height="140" fit="fill" />
        <div class="info">
            <var-checkbox v-model="game.selected" v-if="!showOnly">
                {{ game.title }}
            </var-checkbox>
            <div v-else>
                {{ game.title }}
            </div>
        </div>
        <var-chip class="absolute top-8px right-8px" type="warning" size="small">{{ game.platform }}</var-chip>
    </div>
</template>

<style scoped>
.game {
    @apply w-300px h-[190px] rounded-md overflow-hidden relative;
}

.game .info {
    @apply w-[100%] h-[50px] bg-$game-item-title-bg-color px-8px py-4px text-$game-item-title-color;
}
</style>