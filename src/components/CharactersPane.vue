<template>
  <CardComponent id="characters">
    <HeadingComponent level="2">Characters</HeadingComponent>

    <FormToggleComponent
      @save="validatedAdd"
      @toggle="toggleAddingControls"
      :show-controls="showAddingControls"
    >
      <template #button> Add a new Character? </template>
      <template #form>
        <input
          type="text"
          placeholder="Name"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newCharacter.name"
          @keyup.enter="validatedAdd"
        />
        <textarea
          placeholder="Bio"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200 resize-none"
          v-model="newCharacter.bio"
        />
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newCharacter.immortal"
            :true-value="true"
            :false-value="false"
          />
          Immortal?
        </label>
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newCharacter.dead"
            :true-value="true"
            :false-value="false"
          />
          Dead?
        </label>
      </template>
    </FormToggleComponent>

    <FormComponent
      class="my-2"
      ref="editForm"
      @save="validatedUpdate"
      @cancel="closeEditingControls"
      @remove="validatedRemove"
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
        placeholder="Name"
        class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
        v-model="editCharacter.name"
        @keyup.enter="add"
      />
      <textarea
        placeholder="Bio"
        class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200 resize-none"
        v-model="editCharacter.bio"
      />
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editCharacter.immortal"
          :true-value="true"
          :false-value="false"
        />
        Immortal?
      </label>
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editCharacter.dead"
          :true-value="true"
          :false-value="false"
        />
        Dead?
      </label>
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
      <li v-for="character in characters" :key="`character-${character.id}`">
        <CardComponent :class="{ 'bg-red-50': character.immortal }">
          <div class="flex border-b mb-2">
            <HeadingComponent level="6" class="select-none flex-1">
              <div
                :class="{
                  'line-through': character.dead,
                  'cursor-pointer': true,
                }"
                @click="validatedToggle(character)"
              >
                {{ character.name }}
                <span v-if="character.immortal">(Immortal)</span>
              </div>
            </HeadingComponent>
            <div class="flex-initial text-right">
              <span
                class="cursor-pointer mx-2 hover:text-gray-400"
                @click="startEdit(character)"
              >
                Edit
              </span>
            </div>
          </div>
          <div>{{ character.bio }}</div>
        </CardComponent>
      </li>
    </transition-group>
  </CardComponent>
</template>

<script setup>
import CardComponent from 'Components/CardComponent'
import HeadingComponent from 'Components/HeadingComponent'
import FormComponent from 'Components/FormComponent'
import FormToggleComponent from 'Components/FormToggleComponent'
import entityFactory from 'Libs/entities/characters'
import { useCharactersStore } from 'Stores/characters'
import { useNotificationsStore } from 'Stores/notifications'
import { ref, computed, nextTick, useTemplateRef } from 'vue'

const notificationsStore = useNotificationsStore()
const charactersStore = useCharactersStore()

const editForm = useTemplateRef('editForm')

const showAddingControls = ref(false)
const showEditingControls = ref(false)
const editCharacter = ref(entityFactory())
const newCharacter = ref(entityFactory())

const characters = computed(() => charactersStore.sortedCharacters)

const toggleAddingControls = () => {
  notificationsStore.hide()
  showAddingControls.value = !showAddingControls.value
  newCharacter.value = entityFactory()
}

const closeEditingControls = () => {
  notificationsStore.hide()
  showEditingControls.value = false
  editCharacter.value = entityFactory()
}

const validatedToggle = (character) => {
  notificationsStore.hide()

  if (editCharacter.value.id === character.id) {
    notificationsStore.showNotification({
      message: 'You cannot change this character whilst it is being edited.',
      type: 'warning',
    })
    return
  }

  charactersStore.toggle(character)
}

const validatedAdd = () => {
  if (newCharacter.value.name === '' || newCharacter.value.bio === '') {
    notificationsStore.showNotification({
      message: 'You must provide a name & bio.',
      type: 'warning',
    })
    return
  }

  charactersStore.add(newCharacter.value)

  toggleAddingControls()
}

const validatedRemove = () => {
  let toRemove

  characters.value.some((character) => {
    if (character.id === editCharacter.value.id) {
      toRemove = character
      return true
    }
  })

  charactersStore.remove(toRemove)
  closeEditingControls()
}

const validatedUpdate = () => {
  if (editCharacter.value.name === '' || editCharacter.value.bio === '') {
    notificationsStore.showNotification({
      message: 'You must provide a name & bio.',
      type: 'warning',
    })
    return
  }

  charactersStore.update(editCharacter.value)

  closeEditingControls()
}

const startEdit = (character) => {
  editCharacter.value = entityFactory(character)
  showEditingControls.value = true

  // Scroll the edit form in the next tick to allow the dom to be updated.
  nextTick(() => {
    const rect = editForm.value.$el.getBoundingClientRect()
    window.scrollTo({ top: rect.y + window.scrollY, behavior: 'smooth' })
  })
}
</script>
