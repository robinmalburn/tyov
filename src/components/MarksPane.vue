<template>
  <CardComponent id="marks">
    <HeadingComponent level="2">Marks</HeadingComponent>
    <FormToggleComponent 
      @save="add"
      @toggle="toggleControls"
      :showControls="showControls"
    >
      <template #button>
        Add a new Mark?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newMark"
          @keyup.enter="add"
        />
      </template>
    </FormToggleComponent>

    <FormComponent
      class="my-2"
      @save="validatedUpdateMark"
      @cancel="toggleEditingControls"
      @remove="removeMark"
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
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
    >
      <li
        class="my-2"
        v-for="mark in marks"
        :key="`mark-${mark.id}`"
      >
          <div class="grid grid-cols-6">
            <span class="col-span-5">{{mark.description}}</span>
            <span 
              class="cursor-pointer select-none flex-initial text-right mx-2 hover:text-gray-400"
              @click="edit(mark)"
            >
              Edit
            </span>
          </div>
      </li>
    </transition-group>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import FormComponent from 'Components/FormComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import HeadingComponent from 'Components/HeadingComponent';

import { mapMutations, mapState, mapActions } from 'vuex';
import uuid from 'Libs/uuid';

export default{
  name: 'MarksPane',
  data: function() {
      return {
        newMark: '',
        editMark: {},
        showControls: false,
        showEditingControls: false,
      }
  },
  components: {
    CardComponent,
    FormComponent,
    FormToggleComponent,
    HeadingComponent,
  },
  computed: {
    ...mapState('marks', ['marks'])
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('marks', {
      addMark: 'add',
      update: 'update',
      remove: 'remove'
    }),
    add() {
      if (this.newMark === '') {
        this.showNotification({message: 'You must provide a description', type:'warning'});
        return;
      }
      
      this.addMark({
        id: uuid('mark'),
        description: this.newMark
      });

      this.toggleControls();
    },
    removeMark() {
      let markToRemove;

      this.marks.some(mark => {
        if (mark.id === this.editMark.id) {
          markToRemove = mark;
          return true;
        }
      });

      this.remove(markToRemove);
      this.toggleEditingControls();
    },
    edit(mark) {
      this.editMark = {...mark};
      this.showEditingControls = true;
    },
    validatedUpdateMark() {
      if (this.editMark.description === '') {
        this.showNotification({message: 'You must provide a description', type:'warning'});
        return;
      }

      this.update(this.editMark);
      this.toggleEditingControls();
    },
    toggleEditingControls() {
      this.hideNotification();
      this.showEditingControls = !this.showEditingControls;
      this.editMark = {};
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newMark = '';
    },
  }
}
</script>