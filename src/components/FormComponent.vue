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

<script setup lang="ts">
import ButtonComponent from 'Components/ButtonComponent'

type FormButton = {
  type: string
  event: string
  label: string
}

const props = withDefaults(
  defineProps<{
    buttons?: FormButton[]
  }>(),
  {
    buttons: () => [
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
  },
)

defineEmits<(event: string) => void>()
</script>
