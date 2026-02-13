<template>
  <CardComponent id="resources" class="m-1 p-4 border-2 border-gray-100">
    <HeadingComponent level="2">Resources</HeadingComponent>
    <FormToggleComponent
      class="my-2"
      @save="validatedAddResource"
      @toggle="toggleAddingResourceControls"
      :show-controls="showAddingResourceControls"
    >
      <template #button> Add a new Resource? </template>
      <template #form>
        <input
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newResource.name"
          @keyup.enter="validatedAddResource"
        />
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newResource.lost"
            :true-value="true"
            :false-value="false"
          />
          Lost?
        </label>
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newResource.stationary"
            :true-value="true"
            :false-value="false"
          />
          Stationary?
        </label>
      </template>
    </FormToggleComponent>

    <FormToggleComponent
      @save="validatedAddDiary"
      @toggle="toggleAddingDiaryControls"
      :show-controls="showAddingDiaryControls"
      v-if="!hasDiary"
    >
      <template #button> Add a Diary? </template>
      <template #form>
        <input
          type="text"
          placeholder="Name"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newDiary.name"
          @keyup.enter="validatedAddDiary"
        />
        <label>
          <input
            type="checkbox"
            class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
            v-model="newDiary.lost"
            :true-value="true"
            :false-value="false"
          />
          Lost?
        </label>
      </template>
    </FormToggleComponent>

    <FormComponent
      class="my-2"
      @save="validatedUpdateResource"
      @cancel="closeEditingResourceControls"
      @remove="validatedRemoveResource"
      v-show="showEditingResourceControls"
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
        v-model="editResource.name"
        @keyup.enter="validatedAddResource"
      />
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editResource.lost"
          :true-value="true"
          :false-value="false"
        />
        Lost?
      </label>
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editResource.stationary"
          :true-value="true"
          :false-value="false"
        />
        Stationary?
      </label>
    </FormComponent>

    <FormComponent
      class="my-2"
      @save="validatedUpdateDiary"
      @cancel="closeEditingDiaryControls"
      @remove="validatedRemoveDiary"
      v-show="showEditingDiaryControls"
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
        v-model="editDiary.name"
        @keyup.enter="validatedAddResource"
      />
      <label>
        <input
          type="checkbox"
          class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editDiary.lost"
          :true-value="true"
          :false-value="false"
        />
        Lost?
      </label>
    </FormComponent>

    <transition-group
      class="my-2 pb-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
    >
      <li
        class="select-none"
        v-for="resource in resources"
        :key="`resource-${resource.id}`"
      >
        <div class="grid grid-cols-6">
          <span class="col-span-5">
            <span
              class="cursor-pointer hover:text-gray-400"
              @click="validatedToggleResource(resource)"
            >
              <span :class="{ 'line-through': resource.lost }">{{
                resource.name
              }}</span>
              <span v-if="resource.stationary"> (stationary)</span>
            </span>
          </span>
          <span
            class="cursor-pointer select-none flex-initial text-right mx-2 hover:text-gray-400"
            @click="startEditResource(resource)"
          >
            Edit
          </span>
        </div>
      </li>
    </transition-group>
    <transition-group
      class="my-2 border-t pt-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
      v-show="diaries.length > 0"
    >
      <li
        class="select-none"
        v-for="diary in diaries"
        :key="`diary-${diary.id}`"
      >
        <div class="grid grid-cols-6">
          <span class="col-span-5">
            <span
              class="cursor-pointer hover:text-gray-400"
              @click="validatedToggleDiary(diary)"
            >
              <span :class="{ 'line-through': diary.lost }">{{
                diary.name
              }}</span>
              <span class="italic">
                (diary - {{ activeMemories.length }} of 4 memories)</span
              >
            </span>
          </span>
          <span
            class="cursor-pointer select-none flex-initial text-right mx-2 hover:text-gray-400"
            @click="startEditDiary(diary)"
          >
            Edit
          </span>
        </div>
      </li>
    </transition-group>
  </CardComponent>
</template>

<script setup lang="ts">
import CardComponent from 'Components/CardComponent.vue'
import HeadingComponent from 'Components/HeadingComponent.vue'
import FormComponent from 'Components/FormComponent.vue'
import FormToggleComponent from 'Components/FormToggleComponent.vue'
import {
  resourceEntityFactory,
  diaryEntityFactory,
  type Diary,
  type Resource,
} from 'Libs/entities/resources'
import { useResourcesStore } from 'Stores/resources'
import { useNotificationsStore } from 'Stores/notifications'
import { ref, computed } from 'vue'

const resourcesStore = useResourcesStore()
const notificationsStore = useNotificationsStore()

const showAddingResourceControls = ref(false)
const showAddingDiaryControls = ref(false)
const showEditingResourceControls = ref(false)
const showEditingDiaryControls = ref(false)
const newResource = ref<Resource>(resourceEntityFactory())
const newDiary = ref<Diary>(diaryEntityFactory())
const editResource = ref<Resource>(resourceEntityFactory())
const editDiary = ref<Diary>(diaryEntityFactory())

const diaries = computed(() => resourcesStore.sortedDiaries)
const resources = computed(() => resourcesStore.sortedResources)
const activeMemories = computed(() => resourcesStore.activeMemories)
const hasDiary = computed(() => resourcesStore.hasDiary)

const toggleAddingResourceControls = () => {
  notificationsStore.hide()
  showAddingResourceControls.value = !showAddingResourceControls.value
  newResource.value = resourceEntityFactory()
}

const toggleAddingDiaryControls = () => {
  notificationsStore.hide()
  showAddingDiaryControls.value = !showAddingDiaryControls.value
  newDiary.value = diaryEntityFactory()
}

const closeEditingResourceControls = () => {
  notificationsStore.hide()
  showEditingResourceControls.value = false
  editResource.value = resourceEntityFactory()
}

const closeEditingDiaryControls = () => {
  notificationsStore.hide()
  showEditingDiaryControls.value = false
  editDiary.value = diaryEntityFactory()
}

const validatedAddResource = () => {
  if (newResource.value.name === '') {
    notificationsStore.showNotification({
      message: 'You must provide a description.',
      type: 'warning',
    })
    return
  }

  resourcesStore.addResource(newResource.value)
  toggleAddingResourceControls()
}

const validatedToggleResource = (resource: Resource): void => {
  notificationsStore.hide()

  if (editResource.value.id === resource.id) {
    notificationsStore.showNotification({
      message: 'You cannot change this resource whilst it is being edited.',
      type: 'warning',
    })
    return
  }

  resourcesStore.toggleResource(resource)
}

const validatedToggleDiary = (diary: Diary): void => {
  notificationsStore.hide()

  if (editDiary.value.id === diary.id) {
    notificationsStore.showNotification({
      message: 'You cannot change this resource whilst it is being edited.',
      type: 'warning',
    })
    return
  }

  if (hasDiary.value) {
    if (diary.lost) {
      notificationsStore.showNotification({
        message: 'You may only have one active diary.',
        type: 'warning',
      })
      return
    } else if (activeMemories.value.length > 0) {
      notificationsStore.showNotification({
        message: 'Please cross out existing memories before losing the diary.',
        type: 'warning',
      })
      return
    }
  }

  resourcesStore.toggleDiary(diary)
}

const validatedAddDiary = () => {
  if (newDiary.value.name === '') {
    notificationsStore.showNotification({
      message: 'You must provide a description.',
      type: 'warning',
    })
    return
  } else if (resourcesStore.hasDiary && !newDiary.value.lost) {
    notificationsStore.showNotification({
      message: 'You may only have one active diary.',
      type: 'warning',
    })
    return
  }

  resourcesStore.addDiary(newDiary.value)
  toggleAddingDiaryControls()
}

const validatedUpdateResource = () => {
  if (editResource.value.name === '') {
    notificationsStore.showNotification({
      message: 'You must provide a description.',
      type: 'warning',
    })
    return
  }

  resourcesStore.updateResource(editResource.value)

  closeEditingResourceControls()
}

const validatedUpdateDiary = () => {
  if (editDiary.value.name === '') {
    notificationsStore.showNotification({
      message: 'You must provide a description.',
      type: 'warning',
    })
    return
  } else if (
    resourcesStore.hasDiary &&
    editDiary.value.id !== resourcesStore.diary.id &&
    editDiary.value.lost === false
  ) {
    notificationsStore.showNotification({
      message: 'You may only have one active diary.',
      type: 'warning',
    })
    return
  }

  resourcesStore.updateDiary(editDiary.value)

  closeEditingDiaryControls()
}

const validatedRemoveResource = (): void => {
  const resourceToRemove = resources.value.find(
    (resource) => resource.id === editResource.value.id,
  )
  if (!resourceToRemove) {
    return
  }

  resourcesStore.removeResource(resourceToRemove)
  closeEditingResourceControls()
}

const validatedRemoveDiary = (): void => {
  const diaryToRemove = diaries.value.find(
    (diary) => diary.id === editDiary.value.id,
  )
  if (!diaryToRemove) {
    return
  }

  resourcesStore.removeDiary(diaryToRemove)
  closeEditingDiaryControls()
}

const startEditResource = (resource: Resource): void => {
  editResource.value = resourceEntityFactory(resource)
  showEditingResourceControls.value = true
}

const startEditDiary = (diary: Diary): void => {
  editDiary.value = diaryEntityFactory(diary)
  showEditingDiaryControls.value = true
}
</script>
