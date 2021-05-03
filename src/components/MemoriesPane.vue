m<template>
  <CardComponent id="memories">
    <HeadingComponent level="2">Memories</HeadingComponent>

    <FormToggleComponent 
      type="primary"
      @save="validatedAddMemory"
      @toggle="toggleAddingControls"
      :show-controls="showAddingControls"
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
          @keyup.enter="validatedAddMemory"
        />
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newMemory.forgotten"
              :true-value="true"
              :false-value="false"
          />
          Forgotten?
        </label>
        <label v-if="hasDiary && !isDiaryFull">
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newMemory.diary"
              :true-value="diary.id"
              :false-value="''"
          />
          Diarised?
        </label>
      </template>
    </FormToggleComponent>
    <div v-else>
      You must choose to forget a memory to add more.
    </div>

    <FormComponent
      class="my-2"
      ref="editForm"
      @save="validatedUpdate"
      @cancel="closeEditingControls"
      @remove="validatedRemoveMemory"
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
          v-model="editMemory.description"
          @keyup.enter="validatedUpdate"
        />
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="editMemory.forgotten"
              :true-value="true"
              :false-value="false"
          />
          Forgotten?
        </label>
        <label v-if="(hasDiary && !isDiaryFull) || editMemory.diary !== ''">
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="editMemory.diary"
              :true-value="diary.id"
              :false-value="''"
          />
          Diarised?
        </label>

        <div class="mt-2" v-if="hasEvents(editMemory)">
          <HeadingComponent level="6">
            Events
          </HeadingComponent>
          <div
            v-for="event in events(editMemory)"
            :key="`edit-event-${event.id}`"
          >
              <input 
                type="text"
                placeholder="Description"
                class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
                v-model="event.description"
              />
          </div>
        </div>
    </FormComponent>

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
        @remove-event="validatedRemoveEvent"
        @edit-memory="startEdit"
        @toggle-memory="toggleMemory"
        @diarise-memory="diariseMemory"
        @undiarise-memory="undiariseMemory"
    />
    </transition-group>

    <SlideDownPanelComponent v-if="hasDiary">
        <template #closed-heading>
            Diary
        </template>
          <div v-if="diaryMemories.length > 0">
            <transition-group
                enter-active-class="transition-all duration-400 ease-out"
                leave-active-class="transition-all duration-400 ease-in"
                enter-class="opacity-0 scale-40"
                enter-to-class="opacity-100 scale-100"
                leave-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-40"
            >
                <MemoryComponent
                    v-for="memory in diaryMemories"
                    :key="`diary-${memory.id}`"
                    :memory="memory"
                    :can-add-memories="canAdd"
                    @add-event="addEvent"
                    @remove-event="validatedRemoveEvent"
                    @edit-memory="startEdit"
                    @toggle-memory="toggleMemory"
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
                    @remove-event="validatedRemoveEvent"
                    @edit-memory="startEdit"
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
import FormComponent from 'Components/FormComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import MemoryComponent from 'Components/MemoryComponent';
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { memoryEntityFactory } from 'Libs/entities/memories';

export default {
  name: 'MemoriesPane',
  data() {
    return {
      showAddingControls: false,
      showEditingControls: false,
      editMemory: memoryEntityFactory(),
      newMemory: memoryEntityFactory(),
    }
  },
  components: {
      CardComponent,
      FormComponent,
      FormToggleComponent,
      HeadingComponent,
      MemoryComponent,
      SlideDownPanelComponent,
  },
  computed: {
    ...mapState('memories', ['memories']),
    ...mapGetters('memories', ['canAdd', 'forgottenMemories', 'activeMemories', 'events', 'hasEvents']),
    ...mapGetters('resources', {
        diary: 'diary', 
        hasDiary: 'hasDiary', 
        isDiaryFull: 'isDiaryFull', 
        diaryMemories: 'memories',
    }),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('memories', [
      'addMemory',
      'updateMemory',
      'removeMemory',
      'toggleMemory',
      'addEvent',
      'removeEvent',
      'diarise',
      'undiarise',
    ]),
    validatedAddMemory() {
      this.hideNotification
      if (this.newMemory.description === '') {
        this.showNotification({message: 'You must provide a description.', type:'warning'});
        return;
      }

      const memory = memoryEntityFactory(this.newMemory);

      this.addMemory(memory);

      this.toggleAddingControls();
    },
    validatedRemoveMemory(){
      this.removeMemory(this.editMemory);

      this.closeEditingControls();
    },
    validatedRemoveEvent({memory, event}) {
      this.removeEvent({memory, event});
      
    },
    validatedUpdate(){
      this.updateMemory(this.editMemory);

      this.closeEditingControls();
    },
    diariseMemory(memory) {
      this.diarise({diary: this.diary, memory});
    },
    undiariseMemory(memory) {
      this.undiarise(memory);
    },
    startEdit(memory) {
      this.editMemory = memoryEntityFactory(memory);
      this.showEditingControls = true;

      // Scroll the edit form in the next tick to allow the dom to be updated.
      this.$nextTick(() => {
        const rect = this.$refs.editForm.$el.getBoundingClientRect();
        window.scrollTo({top: rect.y + window.scrollY, behavior: 'smooth'});
      });
    },
    toggleAddingControls() {
      this.newMemory = memoryEntityFactory();

      this.showAddingControls = !this.showAddingControls;
    },
    closeEditingControls() {
      this.hideNotification();
      this.showEditingControls = false;
      this.editMemory = memoryEntityFactory();
    },
  },
}
</script>a