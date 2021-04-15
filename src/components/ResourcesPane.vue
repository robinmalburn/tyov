<template>
  <CardComponent id="resources" class="m-1 p-4 border-2 border-gray-100">
    <HeadingComponent level="2">Resources</HeadingComponent>
    <FormToggleComponent 
      class="my-2"
      @save="validatedAddResource"
      @toggle="toggleResourceControls"
      :showControls="showControls"
    >
      <template #button>
        Add a new Resource?
      </template>
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
      @toggle="toggleDiaryControls"
      :showControls="showDiary"
      v-if="!hasDiary"
    >
      <template #button>
        Add a Diary?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Name"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newDiary.name"
          @keyup.enter="addDiary"
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

    <transition-group
      class="my-2 pb-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
    >
      <li
        class="cursor-pointer select-none"
        v-for="resource in resources"
        :key="`resource-${resource.id}`"
      >
        <span @click="toggleResource(resource)">
          <span :class="{'line-through': resource.lost}">{{resource.name}}</span>
          <span v-if="resource.stationary"> (stationary)</span>
        </span>
        <RemoveCrossComponent @remove="removeResource(resource)" />
      </li>
    </transition-group>
    <transition-group
      class="my-2 border-t pt-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
      v-show="diaries.length > 0"
    >
      <li
        class="cursor-pointer select-none"
        v-for="diary in diaries" 
        :key="`diary-${diary.id}`"
      >
        <span @click="validatedToggleDiary(diary)">
          <span :class="{'line-through': diary.lost}">{{diary.name}}</span>
            <span class="italic"> (diary - {{ memories(diary) }} of 4 memories)</span>
        </span>
        <RemoveCrossComponent @remove="removeDiary(diary)"/>
      </li>
    </transition-group>
  </CardComponent>
</template>
<HeadingComponent level="2">Marks</HeadingComponent>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import uuid from 'Libs/uuid';

export default {
  name: 'ResourcesPane',
  data: function() {
      return {
          showControls: false,
          showDiary: false,
          newResource: {
              name: '',
              lost: false,
              stationary: false,
          },
          newDiary: {
            name: '',
            lost: false,
            memories: [],
          }
      }
  },
  components: {
      CardComponent,
      FormToggleComponent,
      HeadingComponent,
      RemoveCrossComponent,
  },
  computed: {
    ...mapGetters('resources', ['hasDiary', 'diaries', 'resources']),
    memories() {
      return (diary) => {
        return diary.memories.reduce((carry, memory) => {
            if (!memory.forgotten) {
              return carry + 1;
            }

            return carry;
        }, 0)
      }
    }
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('resources', [
      'addResource',
      'removeResource',
      'toggleResource',
      'addDiary',
      'removeDiary',
      'toggleDiary',
    ]),
    validatedAddResource(){
      if (this.newResource.name === '') {
        this.showNotification({message: 'You must provide a description.', type: 'warning'});
        return;
      }

      this.addResource({
        id: uuid('resource'),
        ...this.newResource
      });
      this.toggleResourceControls();
    },
    validatedToggleDiary(diary) {
      this.hideNotification();

      if (this.hasDiary) {
        if (diary.lost ) {
          this.showNotification({message: 'You may only have one active diary.', type: 'warning'});
          return;
        } else if (this.memories(diary) > 0) {
          this.showNotification({message: 'Please cross out existing memories before losing the diary.', type: 'warning'});
          return;
        }
      }

      this.toggleDiary(diary);
    },
    validatedAddDiary() {
      if (this.newDiary.name === '') {
        this.showNotification({message: 'You must provide a description.', type: 'warning'});
        return;
      } else if (this.hasDiary) {
        this.showNotification({message: 'You may only have one active diary.', type: 'warning'});
        return;
      }

      this.addDiary({
        id: uuid('diary'),
        ...this.newDiary
      });
      this.toggleDiaryControls();
    },
    toggleResourceControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newResource = {
          name: '',
          lost: false,
          stationary: false,
        };
    },
    toggleDiaryControls() {
      this.hideNotification();
      this.showDiary = !this.showDiary;
      this.newDiary = {
        name: '',
        lost: false,
        memories: [],
      }
    }
  }
}
</script>