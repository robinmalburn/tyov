<template>
  <CardComponent>
    <div class="flex border-b mb-2">
      <HeadingComponent class="flex-1" level="6">
        {{ memory.description }}
      </HeadingComponent>
      <div class="flex-initial text-right">
        <RemoveCrossComponent @remove="$emit('remove-memory', memory)" />
      </div>
    </div>
    
    <ul class="my-3">
      <li
          v-for="(event, idx) in memory.events"
          :key="`event-${idx}`"
      >
          <CardComponent>
            <div class="flex">
              <span :class="{'flex-1': true, 'line-through': memory.forgotten, 'text-gray-400': memory.forgotten}">{{event}}</span>
              <div class="text-right flex-inital">
                <RemoveCrossComponent @remove="$emit('remove-event', {memory, idx})" />
              </div>
            </div>
          </CardComponent>
      </li>
    </ul>
    
    <FormToggleComponent 
      @save="add"
      @toggle="toggleControls"
      :showControls="showControls"
      v-if="memory.events.length < 3 && !memory.forgotten && !memory.diarised"
    >
      <template #button>  
        Add an Event?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newEvent"
          @keyup.enter="add"
        />
      </template>
    </FormToggleComponent>
  

    <div class="my-2 grid grid-rows gap-2" v-show="(!memory.forgotten || memory.forgotten && memory.diarised) || canAddMemories">
      <ButtonComponent
        class="w-full"
        @click="$emit('toggle-memory', memory)"
      >
        <span v-if="memory.forgotten">
          Recover Memory
        </span>
        <span v-else-if="!memory.diarised">
          Forget Memory
        </span>
        <span v-else>
          Scratch Out Memory
        </span>
      </ButtonComponent>
      
      <template v-if="!memory.forgotten && hasDiary">
        <ButtonComponent 
          class="w-full"
          @click="$emit('diarise-memory', memory)"
          v-if="!memory.diarised && !isDiaryFull"
        >
          Send to Diary
        </ButtonComponent>
        <ButtonComponent 
          class="w-full"
          @click="$emit('undiarise-memory', memory)"
          v-else-if="memory.diarised && canAddMemories"
        >
          Recover from Diary
        </ButtonComponent>
      </template>
    </div>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import ButtonComponent from 'Components/ButtonComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import HeadingComponent from 'Components/HeadingComponent';
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  name: 'MemoryComponent',
  props: {
    memory: {
      type: Object,
      required: true,
      validator: (memory) => Array.isArray(memory.events) && 'boolean' === typeof memory.forgotten,
    },
    canAddMemories: {
      type: Boolean,
      required: true,
    }
  },
  data: function() {
      return {
          showControls: false,
          newEvent:  '',
      }
  },
  components: {
    ButtonComponent,
    CardComponent,
    FormToggleComponent,
    HeadingComponent,
    RemoveCrossComponent,
  },
  computed: {
    ...mapGetters('resources', ['hasDiary', 'isDiaryFull']),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    add(){
      if (this.newEvent === '') {
        this.showNotification({message: 'You must provide a description', type: 'warning'});
        return;
      }
      this.$emit('add-event', {memory: this.memory, event: this.newEvent});
      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newEvent = '';
    },
  }
}
</script>