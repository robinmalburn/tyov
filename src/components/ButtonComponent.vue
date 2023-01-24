<template>
    <button
        class="py-1 px-4 rounded transition-colors focus:outline-none focus:ring-2 ring-0"
        :class="typeClasses"
        @click="$emit('click')"
    >
        <slot />
    </button>
</template>

<script>
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
export default {
  name: 'ButtonComponent',
  props: {
      type: {
          type: String,
          default: 'default',
          valiator: (type) => BUTTON_TYPES.keys().includes(type)
      }
  },
  computed: {
      typeClasses() {
          return BUTTON_TYPES[this.type];
      }
  }
}
</script>
