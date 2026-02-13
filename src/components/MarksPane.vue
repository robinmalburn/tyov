<template>
  <CardComponent id="marks">
    <HeadingComponent level="2">Marks</HeadingComponent>
    <FormToggleComponent
      @save="validatedAddMark"
      @toggle="toggleAddingControls"
      :show-controls="showAddingControls"
    >
      <template #button> Add a new Mark? </template>
      <template #form>
        <input
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newMark.description"
          @keyup.enter="validatedAddMark"
        />
      </template>
    </FormToggleComponent>

    <FormComponent
      class="my-2"
      @save="validatedUpdateMark"
      @cancel="closeEditingControls"
      @remove="validatedRemoveMark"
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
        v-model="editMark.description"
        @keyup.enter="validatedUpdateMark"
      />
    </FormComponent>

    <transition-group
      class="my-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
    >
      <li class="my-2" v-for="mark in marks" :key="`mark-${mark.id}`">
        <div class="grid grid-cols-6">
          <span class="col-span-5">{{ mark.description }}</span>
          <span
            class="cursor-pointer select-none flex-initial text-right mx-2 hover:text-gray-400"
            @click="startEdit(mark)"
          >
            Edit
          </span>
        </div>
      </li>
    </transition-group>
  </CardComponent>
</template>

<script setup>
import CardComponent from 'Components/CardComponent'
import FormComponent from 'Components/FormComponent'
import FormToggleComponent from 'Components/FormToggleComponent'
import HeadingComponent from 'Components/HeadingComponent'
import entityFactory from 'Libs/entities/marks'
import { useMarksStore } from 'Stores/marks'
import { useNotificationsStore } from 'Stores/notifications'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const marksStore = useMarksStore()
const notificationStore = useNotificationsStore()

const newMark = ref(entityFactory())
const editMark = ref(entityFactory())
const showAddingControls = ref(false)
const showEditingControls = ref(false)

const marks = computed(() => marksStore.marks)

const toggleAddingControls = () => {
  notificationStore.hide()
  showAddingControls.value = !showAddingControls.value
  newMark.value = entityFactory()
}

const closeEditingControls = () => {
  notificationStore.hide()
  showEditingControls.value = false
  editMark.value = entityFactory()
}

const validatedAddMark = () => {
  if (newMark.value.description === '') {
    notificationStore.showNotification({
      message: 'You must provide a description',
      type: 'warning',
    })
    return
  }

  marksStore.add(newMark.value)

  toggleAddingControls()
}

const validatedRemoveMark = () => {
  let markToRemove

  marks.value.some((mark) => {
    if (mark.id === editMark.value.id) {
      markToRemove = mark
      return true
    }
  })

  marksStore.remove(markToRemove)

  closeEditingControls()
}

const validatedUpdateMark = () => {
  if (editMark.value.description === '') {
    notificationStore.showNotification({
      message: 'You must provide a description',
      type: 'warning',
    })
    return
  }

  marksStore.update(editMark.value)
  closeEditingControls()
}

const startEdit = (mark) => {
  editMark.value = entityFactory(mark)
  showEditingControls.value = true
}
</script>
