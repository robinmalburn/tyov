<template>
  <div>
    <ButtonComponent
      class="w-full"
      :type="type"
      v-if="!showControls"
      @click="$emit('toggle', showControls)"
    >
      <slot name="button" />
    </ButtonComponent>
    <div v-else>
      <FormComponent
        @save="$emit('save')"
        @cancel="$emit('toggle', showControls)"
      >
        <slot name="form" />
      </FormComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from 'Components/ButtonComponent.vue'
import FormComponent from 'Components/FormComponent.vue'

const props = defineProps({
  showControls: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'default',
    validator: (value: string) =>
      ['default', 'primary', 'secondary'].includes(value),
  },
})

const emit = defineEmits<{
  toggle: [showControls: boolean]
  save: []
}>()

defineSlots<{
  button?: () => unknown
  form?: () => unknown
}>()
</script>
