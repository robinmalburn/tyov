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

<script>
import ButtonComponent from 'Components/ButtonComponent';
import FormComponent from 'Components/FormComponent';

export default {
  name: 'FormToggleComponent',
  props: {
    showControls: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'secondary'].includes(value),
    }
  },
  components: {
    ButtonComponent,
    FormComponent,
  },
}
</script>
