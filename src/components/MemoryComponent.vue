<template>
  <CardComponent>
    <div class="flex border-b mb-2">
      <HeadingComponent :class="{'flex-1': true, 'line-through': memory.forgotten}" level="6">
        {{ memory.description }}
      </HeadingComponent>
      <div class="flex-initial text-right">
        <span 
          class="cursor-pointer mx-2 hover:text-gray-400"
          @click="$emit('edit-memory', memory)"
        >
          Edit
        </span>
      </div>
    </div>
    
    <ul class="my-3">
      <li
          v-for="event in events(memory)"
          :key="`event-${event.id}`"
      >
          <CardComponent>
            <div class="flex">
              <span :class="{'flex-1': true, 'line-through': memory.forgotten, 'text-gray-400': memory.forgotten}">{{event.description}}</span>
              <div class="text-right flex-inital">
                <RemoveCrossComponent @remove="$emit('remove-event', event)" />
              </div>
            </div>
          </CardComponent>
      </li>
    </ul>
    
    <FormToggleComponent 
      @save="add"
      @toggle="toggleControls"
      :showControls="showControls"
      v-if="canAddEvents"
    >
      <template #button>  
        Add an Event?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newEvent.description"
          @keyup.enter="add"
        />
      </template>
    </FormToggleComponent>
  

    <div class="my-2 grid grid-rows gap-2" v-show="canToggle && ((!memory.forgotten || memory.forgotten && memory.diary !== '') || canAddMemories)">
      <ButtonComponent
        class="w-full"
        @click="$emit('toggle-memory', memory)"
      >
        <span v-if="memory.forgotten">
          Recover Memory
        </span>
        <span v-else-if="memory.diary === ''">
          Forget Memory
        </span>
        <span v-else>
          Scratch Out Memory
        </span>
      </ButtonComponent>
      
      <template v-if="canDiarise">
        <ButtonComponent 
          class="w-full"
          @click="$emit('diarise-memory', memory)"
          v-if="memory.diary === '' && !isDiaryFull"
        >
          Send to Diary
        </ButtonComponent>
        <ButtonComponent 
          class="w-full"
          @click="$emit('undiarise-memory', memory)"
          v-else-if="memory.diary !== '' && canAddMemories"
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
import { eventEntityFactory } from 'Libs/entities/memories';

export default {
  name: 'MemoryComponent',
  props: {
    memory: {
      type: Object,
      required: true,
      validator: (memory) => 'string' === typeof memory.diary && 'boolean' === typeof memory.forgotten,
    },
    canAddMemories: {
      type: Boolean,
      required: true,
    },
    canAddEvents: {
      type: Boolean,
      required: true,
    },
    canDiarise: {
      type: Boolean,
      required: true,
    },
    canToggle: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
      return {
          showControls: false,
          newEvent:  eventEntityFactory({memory: this.memory.id}),
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
    ...mapGetters('memories', ['events']),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    add(){
      if (this.newEvent.description === '') {
        this.showNotification({message: 'You must provide a description', type: 'warning'});
        return;
      }

      const event = eventEntityFactory(this.newEvent);

      this.$emit('add-event', event);
      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newEvent = eventEntityFactory({memory: this.memory.id});
    },
  }
}
</script>