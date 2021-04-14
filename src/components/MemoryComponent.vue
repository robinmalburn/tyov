<template>
  <CardComponent>
    <div class="text-right">
      <RemoveCrossComponent @remove="$emit('remove-memory', memory)" />
    </div>
    
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
    
    <ul class="my-3">
        <li
            v-for="(event, idx) in memory.events"
            :key="`event-${idx}`"
        >
            <span :class="{'line-through': memory.forgotten, 'text-gray-400': memory.forgotten}">{{event}}</span>
            <RemoveCrossComponent 
                @remove="$emit('remove-event', {memory, idx})"
            />
        </li>
    </ul>

    <div class="my-2 grid grid-rows gap-2" v-show="!memory.forgotten || canAddMemories">
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
          v-else-if="memory.diarised"
        >
          Recover from Diary
        </ButtonComponent>
      </template>
    </div>
  </CardComponent>
</template>

<script>
import CardComponent from './CardComponent';
import ButtonComponent from './ButtonComponent';
import FormToggleComponent from './FormToggleComponent';
import RemoveCrossComponent from './RemoveCrossComponent';
import { mapGetters } from 'vuex';

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
    RemoveCrossComponent,
  },
  computed: {
    ...mapGetters('resources', ['hasDiary', 'isDiaryFull']),
  },
  methods: {
    add(){
      if (this.newEvent !== '') {
        this.$emit('add-event', {memory: this.memory, event: this.newEvent});
        this.toggleControls();
      }
    },
    toggleControls() {
      this.showControls = !this.showControls;
      this.newEvent = '';
    },
  }
}
</script>