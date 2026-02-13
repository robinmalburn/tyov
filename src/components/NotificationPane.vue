<template>
  <transition
    enter-active-class="transition-all duration-400 ease-out"
    leave-active-class="transition-all duration-400 ease-in"
    enter-from-class="opacity-0 scale-40"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-40"
  >
    <div :class="classes" v-show="notificationStore.visible">
      <div class="flex-1">
        {{ notificationStore.message }}
      </div>
      <RemoveCrossComponent
        class="flex-initial"
        @remove="notificationStore.hide"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import RemoveCrossComponent from 'Components/RemoveCrossComponent.vue'
import { computed, watch } from 'vue'
import { useNotificationsStore } from 'Stores/notifications'

const notificationStore = useNotificationsStore()

const TYPES = {
  default: {
    'border-indigo-400': true,
    'bg-indigo-100': true,
    'text-indigo-600': true,
  },
  danger: {
    'border-red-600': true,
    'bg-red-200': true,
    'text-red-800': true,
  },
  warning: {
    'border-yellow-400': true,
    'bg-yellow-100': true,
    'text-yellow-600': true,
  },
}

let timer: ReturnType<typeof setTimeout> | null = null
const timeout = 5000

const classes = computed(() => {
  return {
    sticky: true,
    'inset-6': true,
    border: true,
    rounded: true,
    'p-2': true,
    flex: true,
    ...TYPES[notificationStore.type],
  }
})

watch(
  () => notificationStore.visible,
  (value) => {
    if (timer) {
      clearTimeout(timer)
    }

    if (value) {
      timer = setTimeout(() => {
        notificationStore.hide()
      }, timeout)
    }
  },
)
</script>
