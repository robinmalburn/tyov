<template>
  <CardComponent id="memories">
    <HeadingComponent level="2">Memories</HeadingComponent>

    <FormToggleComponent
      type="primary"
      @save="validatedAddMemory"
      @toggle="toggleAddingControls"
      :show-controls="showAddingControls"
      v-if="canAddMemories"
    >
      <template #button> Add a new Memory? </template>
      <template #form>
        <input
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newMemory.description"
          @keyup.enter="validatedAddMemory"
        />
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newMemory.forgotten"
            :true-value="true"
            :false-value="false"
          />
          Forgotten?
        </label>
        <label v-if="hasDiary && !isDiaryFull">
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newMemory.diary"
            :true-value="diary.id"
            :false-value="''"
          />
          Diarised?
        </label>
      </template>
    </FormToggleComponent>
    <div v-else>You must choose to forget a memory to add more.</div>

    <FormComponent
      class="my-2"
      ref="editForm"
      @save="validatedUpdateMemory"
      @cancel="closeEditingControls"
      @remove="validatedRemoveMemory"
      v-show="showEditingControls"
      :buttons="[
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
        {
          type: 'default',
          event: 'remove',
          label: 'Remove',
        },
      ]"
    >
      <input
        type="text"
        placeholder="Description"
        class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
        v-model="editMemory.description"
        @keyup.enter="validatedUpdateMemory"
      />
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editMemory.forgotten"
          :true-value="true"
          :false-value="false"
        />
        Forgotten?
      </label>
      <label v-if="(hasDiary && !isDiaryFull) || editMemory.diary !== ''">
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editMemory.diary"
          :true-value="diary.id"
          :false-value="''"
        />
        Diarised?
      </label>

      <div class="mt-2" v-if="hasEvents(editMemory)">
        <HeadingComponent level="6"> Events </HeadingComponent>
        <div v-for="event in editEvents" :key="`edit-event-${event.id}`">
          <input
            type="text"
            placeholder="Description"
            class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="event.description"
          />
        </div>
      </div>
    </FormComponent>

    <transition-group
      enter-active-class="transition-all duration-400 ease-out"
      leave-active-class="transition-all duration-400 ease-in"
      enter-from-class="opacity-0 scale-40"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-40"
    >
      <MemoryComponent
        v-for="memory in activeMemories"
        :key="`memory-${memory.id}`"
        :memory="memory"
        :can-add-memories="canAddMemories"
        :can-add-events="
          memory.id !== editMemory.id && events(memory).length < 3
        "
        :can-diarise="hasDiary && memory.id !== editMemory.id"
        :can-toggle="memory.id !== editMemory.id"
        @add-event="addEvent"
        @remove-event="validatedRemoveEvent"
        @edit-memory="startEdit"
        @toggle-memory="toggleMemory"
        @diarise-memory="diariseMemory"
        @undiarise-memory="undiariseMemory"
      />
    </transition-group>

    <SlideDownPanelComponent v-if="hasDiary">
      <template #closed-heading> Diary </template>
      <div v-if="diaryMemories.length > 0">
        <transition-group
          enter-active-class="transition-all duration-400 ease-out"
          leave-active-class="transition-all duration-400 ease-in"
          enter-from-class="opacity-0 scale-40"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-40"
        >
          <MemoryComponent
            v-for="memory in diaryMemories"
            :key="`diary-${memory.id}`"
            :memory="memory"
            :can-add-memories="canAddMemories"
            :can-add-events="false"
            :can-diarise="hasDiary"
            :can-toggle="memory.id !== editMemory.id"
            @add-event="addEvent"
            @remove-event="validatedRemoveEvent"
            @edit-memory="startEdit"
            @toggle-memory="toggleMemory"
            @diarise-memory="diariseMemory"
            @undiarise-memory="undiariseMemory"
          />
        </transition-group>
      </div>
      <div class="py-2" v-else>The diary is empty.</div>
    </SlideDownPanelComponent>

    <SlideDownPanelComponent>
      <template #closed-heading> Forgotten Memories </template>
      <div v-if="forgottenMemories.length > 0">
        <transition-group
          enter-active-class="transition-all duration-400 ease-out"
          leave-active-class="transition-all duration-400 ease-in"
          enter-from-class="opacity-0 scale-40"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-40"
        >
          <MemoryComponent
            v-for="memory in forgottenMemories"
            :key="`memory-${memory.id}`"
            :memory="memory"
            :can-add-memories="canAddMemories"
            :can-add-events="false"
            :can-diarise="false"
            :can-toggle="memory.id !== editMemory.id"
            @add-event="addEvent"
            @remove-event="validatedRemoveEvent"
            @edit-memory="startEdit"
            @toggle-memory="toggleMemory"
            @diarise-memory="diariseMemory"
            @undiarise-memory="undiariseMemory"
          />
        </transition-group>
      </div>
      <div class="py-2" v-else>You have forgotten no memories... yet.</div>
    </SlideDownPanelComponent>
  </CardComponent>
</template>

<script setup>
import CardComponent from 'Components/CardComponent'
import HeadingComponent from 'Components/HeadingComponent'
import FormComponent from 'Components/FormComponent'
import FormToggleComponent from 'Components/FormToggleComponent'
import MemoryComponent from 'Components/MemoryComponent'
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent'
import { memoryEntityFactory, eventEntityFactory } from 'Libs/entities/memories'
import { computed, ref, nextTick, useTemplateRef } from 'vue'
import { useMemoriesStore } from 'Stores/memories'
import { useResourcesStore } from 'Stores/resources'
import { useNotificationsStore } from 'Stores/notifications'

const showAddingControls = ref(false)
const showEditingControls = ref(false)
const editMemory = ref(memoryEntityFactory())
const editEvents = ref([])
const newMemory = ref(memoryEntityFactory())

const memoriesStore = useMemoriesStore()
const resourcesStore = useResourcesStore()
const notificationStore = useNotificationsStore()

const editForm = useTemplateRef('editForm')

const canAddMemories = computed(() => memoriesStore.canAddMemories)
const forgottenMemories = computed(() => memoriesStore.forgottenMemories)
const activeMemories = computed(() => memoriesStore.activeMemories)
const diary = computed(() => resourcesStore.diary)
const hasDiary = computed(() => resourcesStore.hasDiary)
const isDiaryFull = computed(() => resourcesStore.isDiaryFull)
const diaryMemories = computed(() => resourcesStore.memories)

const events = (memory) => memoriesStore.sortedEvents(memory)
const hasEvents = (memory) => memoriesStore.hasEvents(memory)

const toggleAddingControls = () => {
  notificationStore.hide()
  showAddingControls.value = !showAddingControls.value
  newMemory.value = memoryEntityFactory()
}

const closeEditingControls = () => {
  notificationStore.hide()
  showEditingControls.value = false
  editMemory.value = memoryEntityFactory()
  editEvents.value = []
}

const validatedAddMemory = () => {
  notificationStore.hide()
  if (newMemory.value.description === '') {
    notificationStore.showNotification({
      message: 'You must provide a description.',
      type: 'warning',
    })
    return
  }

  const memory = memoryEntityFactory(newMemory.value)

  memoriesStore.addMemory(memory)

  toggleAddingControls()
}

const validatedRemoveMemory = () => {
  notificationStore.hide()
  if (hasEvents(editMemory.value)) {
    events(editMemory.value).forEach((event) => {
      memoriesStore.removeEvent(event)
    })
  }

  memoriesStore.removeMemory(editMemory.value)

  closeEditingControls()
}

const validatedRemoveEvent = (event) => {
  notificationStore.hide()
  if (event.memory === editMemory.value.id) {
    notificationStore.showNotification({
      message: 'You cannot alter this memory whilst it is being edited.',
      type: 'warning',
    })
    return
  }

  memoriesStore.removeEvent(event)
}

const validatedUpdateMemory = () => {
  notificationStore.hide()
  memoriesStore.updateMemory(editMemory.value)

  if (hasEvents(editMemory.value)) {
    editEvents.value.forEach((event) => memoriesStore.updateEvent(event))
  }

  closeEditingControls()
}

const diariseMemory = (memory) => {
  memoriesStore.diarise({ diary: diary.value, memory })
}

const undiariseMemory = (memory) => {
  memoriesStore.undiarise(memory)
}

const addEvent = (memory) => {
  memoriesStore.addEvent(memory)
}

const toggleMemory = (memory) => {
  memoriesStore.toggleMemory(memory)
}

const startEdit = (memory) => {
  notificationStore.hide()
  editMemory.value = memoryEntityFactory(memory)
  editEvents.value = events(editMemory.value).map((event) =>
    eventEntityFactory(event),
  )
  showEditingControls.value = true

  // Scroll the edit form in the next tick to allow the dom to be updated.
  nextTick(() => {
    const rect = editForm.value.$el.getBoundingClientRect()
    window.scrollTo({ top: rect.y + window.scrollY, behavior: 'smooth' })
  })
}
</script>
