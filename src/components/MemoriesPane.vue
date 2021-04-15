<template>
  <CardComponent id="memories">
    <HeadingComponent level="2">Memories</HeadingComponent>

    <FormToggleComponent 
      type="primary"
      @save="addMemory"
      @toggle="toggleControls"
      :showControls="showControls"
      v-if="canAdd"
    >
      <template #button>
        Add a new Memory?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newMemory.description"
          @keyup.enter="addMemory"
        />
      </template>
    </FormToggleComponent>
    <div v-else>
      You must choose to forget a memory to add more.
    </div>

    <transition-group
        enter-active-class="transition-all duration-400 ease-out"
        leave-active-class="transition-all duration-400 ease-in"
        enter-class="opacity-0 scale-40"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-40"
    >
      <MemoryComponent
        v-for="memory in activeMemories"
        :key="`memory-${memory.id}`"
        :memory="memory"
        :can-add-memories="canAdd"
        @add-event="addEvent"
        @remove-event="removeEvent"
        @remove-memory="removeMemory"
        @toggle-memory="toggle"
        @diarise-memory="diariseMemory"
        @undiarise-memory="undiariseMemory"
    />
    </transition-group>

    <SlideDownPanelComponent v-if="hasDiary">
        <template #closed-heading>
            Diary
        </template>
          <div v-if="diary && diary.memories.length > 0">
            <transition-group
                enter-active-class="transition-all duration-400 ease-out"
                leave-active-class="transition-all duration-400 ease-in"
                enter-class="opacity-0 scale-40"
                enter-to-class="opacity-100 scale-100"
                leave-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-40"
            >
                <MemoryComponent
                    v-for="memory in diary.memories"
                    :key="`diary-${memory.id}`"
                    :memory="memory"
                    :can-add-memories="canAdd"
                    @add-event="addEvent"
                    @remove-event="removeEvent"
                    @remove-memory="removeMemory"
                    @toggle-memory="toggle"
                    @diarise-memory="diariseMemory"
                    @undiarise-memory="undiariseMemory"
                />
            </transition-group>
        </div>
        <div class="py-2" v-else>
          The diary is empty.
        </div>
    </SlideDownPanelComponent>

    <SlideDownPanelComponent>
        <template #closed-heading>
            Forgotten Memories
        </template>
          <div v-if="forgottenMemories.length > 0">
            <transition-group
                enter-active-class="transition-all duration-400 ease-out"
                leave-active-class="transition-all duration-400 ease-in"
                enter-class="opacity-0 scale-40"
                enter-to-class="opacity-100 scale-100"
                leave-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-40"
            >
                <MemoryComponent
                    v-for="memory in forgottenMemories"
                    :key="`memory-${memory.id}`"
                    :memory="memory"
                    :can-add-memories="canAdd"
                    @add-event="addEvent"
                    @remove-event="removeEvent"
                    @remove-memory="removeMemory"
                    @toggle-memory="toggle"
                    @diarise-memory="diariseMemory"
                    @undiarise-memory="undiariseMemory"
                  />
            </transition-group>
        </div>
        <div class="py-2" v-else>
          You have forgotten no memories... yet.
        </div>
    </SlideDownPanelComponent>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import MemoryComponent from 'Components/MemoryComponent';
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import uuid from 'Libs/uuid';

export default {
  name: 'MemoriesPane',
  data() {
    return {
      showControls: false,
      newMemory: {
        description: '',
        events: [],
        forgotten: false,
        diarised: false,
      },
    }
  },
  components: {
      CardComponent,
      FormToggleComponent,
      HeadingComponent,
      MemoryComponent,
      SlideDownPanelComponent,
  },
  computed: {
    ...mapState('memories', ['memories']),
    ...mapGetters('memories', ['canAdd', 'forgottenMemories', 'activeMemories']),
    ...mapGetters('resources', ['diary', 'hasDiary', 'lostDiaries']),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('memories', [
      'add',
      'remove',
      'toggle',
      'addEvent',
      'removeEvent',
      'diarise',
      'undiarise',
    ]),
    ...mapMutations('resources', [
      'addMemoryToDiary',
      'removeMemoryFromDiary',
    ]),
    addMemory() {
      if (this.newMemory.description === '') {
        this.showNotification({message: 'You must provide a description.', type:'warning'});
        return;
      }

      this.add({
        id: uuid('memory'),
        ...this.newMemory
      });
      this.toggleControls();
    },
    removeMemory(memory){
      if (memory.diarised) {
        this.undiariseMemory(memory);
      }

      this.remove(memory);
    },
    diariseMemory(memory) {
      this.addMemoryToDiary({diary: this.diary, memory});
      this.diarise(memory);
    },
    undiariseMemory(memory) {
      this.removeMemoryFromDiary({diary: this.diary, memory});
      this.undiarise(memory);
    },
    toggleControls() {
      this.newMemory = {
        description: '',
        events: [],
        forgotten: false,
        diarised: false,
      };

      this.showControls = !this.showControls;
    },
  },
}
</script>a