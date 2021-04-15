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
      <li v-for="mark in marks" :key="`mark-${mark.id}`">
          <span>{{mark.description}}</span>
          <RemoveCrossComponent 
            @remove="remove(mark)"
          />
      </li>
    </transition-group>
  </CardComponent>
</template>

<script>
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import { mapMutations, mapState, mapActions } from 'vuex';
import uuid from 'Libs/uuid';

export default{
  name: 'MarksPane',
  data: function() {
      return {
        newMark: '',
        showControls: false,
      }
  },
  components: {
    CardComponent,
    HeadingComponent,
    RemoveCrossComponent,
    FormToggleComponent,
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
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newMark = '';
    },
  }
}
</script>