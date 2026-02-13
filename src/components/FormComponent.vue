<template>
  <div>
    <slot />
    <div class="my-1 flex flex-col md:flex-row">
      <ButtonComponent
        class="flex-1 my-2 md:my-0 md:mx-2"
        v-for="button in buttons"
        :key="`${button.label}-${button.type}`"
        :type="button.type"
        @click="$emit(button.event)"
      >
        {{ button.label }}
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup>
import ButtonComponent from 'Components/ButtonComponent'

const props = defineProps({
  buttons: {
    type: Array,
    default: () => [
      {
        type: 'default',
        event: 'save',
        label: 'Save',
      },
      {
        type: 'default',
        event: 'cancel',
        label: 'Cancel',
      },
    ],
    validator: (values) =>
      values.every((btn) => {
        if (typeof btn !== 'object') {
          return false
        }

        const keys = Object.keys(btn)

        return (
          keys.includes('type') &&
          keys.includes('event') &&
          keys.includes('label')
        )
      }),
  },
})
</script>
