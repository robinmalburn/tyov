<script setup>
import { computed, useAttrs } from 'vue'

const HEADING_STYLES = [
  {
    'text-3xl': true,
  },
  {
    'text-2xl': true,
  },
  {
    'text-xl': true,
  },
  {
    'text-base': true,
  },
  {
    'text-sm': true,
  },
  {
    'text-sm': true,
  },
]

const props = defineProps({
  level: {
    type: String,
    default: '1',
    validator: (level) => ['1', '2', '3', '4', '5', '6'].includes(level),
  },
})

const attrs = useAttrs()

const headingTag = computed(() => {
  return `h${Math.min(6, Math.max(1, parseInt(props.level)))}`
})

const headingClasses = computed(() => {
  const extraClasses = {}

  // Handle class from attrs
  if (attrs.class) {
    if (typeof attrs.class === 'string') {
      const classes = attrs.class.split(' ')
      for (const cls of classes) {
        extraClasses[cls] = true
      }
    } else if (typeof attrs.class === 'object') {
      Object.assign(extraClasses, attrs.class)
    }
  }

  return {
    'font-semibold': true,
    'leading-loose': true,
    'tracking-widest': true,
    'text-indigo-800': true,
    ...extraClasses,
    ...HEADING_STYLES[parseInt(props.level) - 1],
  }
})
</script>

<template>
  <component :is="headingTag" :class="headingClasses" v-bind="$attrs">
    <slot />
  </component>
</template>
