<template>
  <div :class="classes">
    <ButtonComponent class="w-full" :type="type" @click="toggle">
      <slot name="closed-heading" v-if="!shouldShow"> Show </slot>

      <slot name="open-heading" v-else> Close </slot>
    </ButtonComponent>
    <slot v-if="shouldShow" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ButtonComponent from './ButtonComponent.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['change'])

const isOpen = ref(props.open)
watch(
  () => props.open,
  (value) => {
    isOpen.value = value
  },
)

const shouldShow = computed(() => isOpen.value)
const type = computed(() => (shouldShow.value ? 'secondary' : 'default'))
const classes = computed(() => ({
  'my-2': true,
  'transition-all': true,
  'p-4': shouldShow.value,
  border: shouldShow.value,
  rounded: shouldShow.value,
  'border-indigo-200': shouldShow.value,
  'shadow-md': shouldShow.value,
  'hover:shadow-xl': shouldShow.value,
}))

function toggle() {
  isOpen.value = !isOpen.value
  emit('change', isOpen.value)
}
</script>
