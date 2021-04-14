<template>
  <CardComponent id="memories">
    <HeadingComponent level="2">Memories</HeadingComponent>

    <ButtonComponent
      class="w-full"
      type="primary"
      @click="addMemory"
      v-if="canAdd"
    >
      Add Memory?
    </ButtonComponent>
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
        v-for="(memory, idx) in activeMemories"
        :key="`memory-${idx}`"
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
                    v-for="(memory, idx) in diary.memories"
                    :key="`diary-${idx}`"
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
                    v-for="(memory, idx) in forgottenMemories"
                    :key="`memory-${idx}`"
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
import CardComponent from './CardComponent';
import ButtonComponent from './ButtonComponent';
import HeadingComponent from './HeadingComponent';
import MemoryComponent from './MemoryComponent';
  import SlideDownPanelComponent from 'Components/SlideDownPanelComponent';

import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  name: 'MemoriesPane',
  components: {
      ButtonComponent,
      CardComponent,
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
      this.add({
          events:[],
          forgotten: false,
          diarised: false,
      });
    },
    removeEvent({memory, idx}){
      memory.events.splice(idx, 1);
    },
    removeMemory(memory){
      if (memory.diarised) {
        this.undiariseMemory(memory);
      }

      const idx = this.memories.indexOf(memory);
      this.remove(idx);
    },
    diariseMemory(memory) {
      this.addMemoryToDiary({diary: this.diary, memory});
      this.diarise(memory);
    },
    undiariseMemory(memory) {
      const idx = this.diary.memories.indexOf(memory);
      this.removeMemoryFromDiary({diary: this.diary, idx});
      this.undiarise(memory);
    }
  }
}
</script>