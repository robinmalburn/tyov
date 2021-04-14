<template>
    <div>
        <ButtonComponent
          class="w-full"
          v-if="!showControls"
          @click="$emit('toggle', showControls)"
        >
            <slot name="button" />
        </ButtonComponent>
        <div v-else>
          <slot name="form" />
          <div class="my-1 grid gap-1 grid-cols-2">
            <ButtonComponent 
              class="w-full"
              @click="$emit('save')"
            >
              Save
            </ButtonComponent>
            <ButtonComponent 
              class="w-full"
              @click="$emit('toggle', showControls)"
            >
              Cancel
            </ButtonComponent>
          </div>
        </div>
    </div>
</template>

<script>
import ButtonComponent from './ButtonComponent';

export default {
  name: 'FormToggleComponent',
  props: {
    showControls: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ButtonComponent,
  },
}
</script>
