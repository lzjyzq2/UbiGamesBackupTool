<script setup lang="ts">
import { currentTheme } from '@/api/theme'
// Add varlet style definition here
</script>

<template>
<var-style-provider :style-vars="currentTheme">
  <RouterView />
</var-style-provider>
</template>