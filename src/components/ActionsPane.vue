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
        @click="actionsStore.roll"
      >
        Roll
      </ButtonComponent>
    </div>

    <SaveMenuComponent />

    <LoadMenuComponent />
  </CardComponent>
</template>

<script setup>
import CardComponent from './CardComponent.vue'
import ButtonComponent from './ButtonComponent.vue'
import HeadingComponent from './HeadingComponent.vue'
import SaveMenuComponent from './SaveMenuComponent.vue'
import LoadMenuComponent from './LoadMenuComponent.vue'
import { storeToRefs } from 'pinia'
import { useActionsStore } from 'Stores/actions'

const actionsStore = useActionsStore()
const { lastRoll, currentRoll } = storeToRefs(actionsStore)
</script>
