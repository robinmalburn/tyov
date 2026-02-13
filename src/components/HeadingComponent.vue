<script setup lang="ts">
import { computed, useAttrs, type HTMLAttributes } from 'vue'

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
    validator: (level: string) =>
      ['1', '2', '3', '4', '5', '6'].includes(level),
  },
})

const attrs = useAttrs()

const headingTag = computed(() => {
  return `h${Math.min(6, Math.max(1, parseInt(props.level)))}`
})

const headingClasses = computed(() => {
  const extraClasses: Record<string, boolean> = {}
  const attrClass = attrs.class as HTMLAttributes['class']

  // Handle class from attrs
  if (attrClass) {
    if (typeof attrClass === 'string') {
      const classes = attrClass.split(' ')
      for (const cls of classes) {
        extraClasses[cls] = true
      }
    } else if (Array.isArray(attrClass)) {
      attrClass
        .filter((value): value is string => typeof value === 'string')
        .forEach((value) => {
          extraClasses[value] = true
        })
    } else if (typeof attrClass === 'object') {
      Object.entries(attrClass).forEach(([key, value]) => {
        if (Boolean(value)) {
          extraClasses[key] = true
        }
      })
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
