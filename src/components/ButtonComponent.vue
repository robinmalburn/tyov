<template>
  <button
    class="py-1 px-4 rounded transition-colors focus:outline-none focus:ring-2 ring-0"
    :class="typeClasses"
  >
    <slot />
  </button>
</template>

<script lang="ts">
const BUTTON_TYPES = {
  default: {
    'bg-gray-200': true,
    'hover:bg-gray-400': true,
    'ring-gray-100': true,
  },
  primary: {
    'bg-red-700': true,
    'hover:bg-red-900': true,
    'text-white': true,
    'ring-red-600': true,
  },
  secondary: {
    'bg-indigo-400': true,
    'hover:bg-indigo-600': true,
    'text-white': true,
    'ring-indigo-300': true,
  },
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = keyof typeof BUTTON_TYPES

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (type: string) => Object.keys(BUTTON_TYPES).includes(type),
  },
})

const typeClasses = computed(() => BUTTON_TYPES[props.type as ButtonType])
</script>
