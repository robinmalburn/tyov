<template>
  <SlideDownPanelComponent v-model="saving">
    <template #closed-heading> Save </template>
    <div class="grid grid-rows gap-1 my-2">
      <a
        class="hidden"
        download="save-game"
        target="_blank"
        ref="download"
        href="about:blank"
      />
      <ButtonComponent class="w-full" @click="toFile">
        To File
      </ButtonComponent>
      <ButtonComponent
        class="w-full"
        @click="toLocalStorage"
        v-if="doesSupportLocalStorage"
      >
        To Local Storage
      </ButtonComponent>
    </div>
  </SlideDownPanelComponent>
</template>

<script setup lang="ts">
import ButtonComponent from 'Components/ButtonComponent.vue'
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent.vue'
import { getStateFromStore, serialize } from 'Libs/gameState'
import localStorage, { supportsLocalStorage } from 'Libs/localStorage'
import { ref, computed, useTemplateRef } from 'vue'

const download = useTemplateRef<HTMLAnchorElement>('download')

const saving = ref(false)

const doesSupportLocalStorage = computed(() => supportsLocalStorage())

const toFile = () => {
  const data = serialize(getStateFromStore())

  if (!download.value) {
    return
  }

  download.value.href = URL.createObjectURL(
    new Blob([data], { type: 'text/plain' }),
  )
  download.value.click()
  saving.value = false
}

const toLocalStorage = () => {
  const data = serialize(getStateFromStore())
  localStorage.set('save-game', data)
  saving.value = false
}
</script>
