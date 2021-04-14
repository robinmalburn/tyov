<template>
  <CardComponent id="actions">
    <HeadingComponent level="2">Actions</HeadingComponent>
    <div class="m-2 text-center">
      <div class="grid grid-cols-2 grid-rows-2 gap2">
        <span class="text-gray-300 dark:text-gray-500">Last roll:</span>
        <span>Current roll: </span>
        <span class="text-gray-300 dark:text-gray-500">{{ lastRoll }}</span>
        <span>{{ currentRoll }}</span>
      </div>
      
      <ButtonComponent
        type="primary"
        class="w-full my-2"
        @click="roll"
      >
        Roll
      </ButtonComponent>
    </div>

    <SaveMenuComponent />

    <LoadMenuComponent />
  </CardComponent>
</template>

<script>
import CardComponent from './CardComponent';
import ButtonComponent from './ButtonComponent';
import HeadingComponent from './HeadingComponent';
import SaveMenuComponent from './SaveMenuComponent';
import LoadMenuComponent from './LoadMenuComponent';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'ActionsPane',
  components: {
    ButtonComponent,
    CardComponent,
    HeadingComponent,
    SaveMenuComponent,
    LoadMenuComponent,
  },
  computed: {
    ...mapGetters('actions', ['die', 'currentRoll']),
    ...mapState('actions', ['d6', 'd10', 'lastRoll']),
  },
  methods: {
    ...mapActions('actions', ['roll']),
  }
}
</script>