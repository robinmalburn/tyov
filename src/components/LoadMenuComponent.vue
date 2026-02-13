<template>
  <SlideDownPanelComponent v-model="loading">
    <template #closed-heading> Load </template>
    <div class="grid grid-rows gap-1 my-2">
      <input type="file" class="hidden" ref="upload" @change="load" />
      <ButtonComponent class="w-full" @click="openUpload">
        From File
      </ButtonComponent>
      <ButtonComponent
        class="w-full"
        @click="fromLocalStorage"
        v-if="doesSupportLocalStorage"
      >
        From Local Storage
      </ButtonComponent>
    </div>
  </SlideDownPanelComponent>
</template>

<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue'
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent.vue'
import { restoreState, deserialize } from 'Libs/gameState'
import localStorage, { supportsLocalStorage } from 'Libs/localStorage'
import { useNotificationsStore } from 'Stores/notifications'
import { ref, computed, useTemplateRef } from 'vue'

const notificationsStore = useNotificationsStore()
const upload = useTemplateRef<HTMLInputElement>('upload')

const loading = ref(false)

const doesSupportLocalStorage = computed(() => supportsLocalStorage())

const load = (evt: Event) => {
  const target = evt.target as HTMLInputElement | null
  if (!target?.files || target.files.length !== 1) {
    notificationsStore.showNotification({
      message: 'Unable to load file.  You must select one file to load.',
      type: 'warning',
    })
    return
  }

  notificationsStore.hide()

  const file = target.files[0]

  const reader = new FileReader()

  reader.onload = () => {
    try {
      if (typeof reader.result !== 'string') {
        throw new Error('Unable to decode save state')
      }
      const data = deserialize(reader.result)
      restoreState(data)
      loading.value = false
    } catch (err) {
      notificationsStore.showNotification({
        message: 'Unable to decode save state.',
        type: 'danger',
      })
    }
  }

  reader.onerror = () => {
    notificationsStore.showNotification({
      message: 'Unable to read file.',
      type: 'danger',
    })
  }

  reader.readAsText(file)
}

const openUpload = (): void => {
  upload.value?.click()
}

const fromLocalStorage = () => {
  notificationsStore.hide()

  try {
    const saveData = localStorage.get('save-game')
    if (typeof saveData !== 'string') {
      throw new Error('Unable to decode save state')
    }
    const data = deserialize(saveData)
    restoreState(data)
  } catch (err) {
    notificationsStore.showNotification({
      message: 'Unable to decode save state.',
      type: 'danger',
    })
  }

  loading.value = false
}
</script>
