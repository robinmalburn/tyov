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

    <ul class="my-3">
        <li
            class="cursor-pointer select-none"
            v-for="(resource, idx) in resources" :key="`resource-${idx}`"
        >
            <span @click="toggleResource(idx)">
                <span :class="{'line-through': resource.lost}">{{resource.name}}</span>
                <span v-if="resource.stationary"> (stationary)</span>
            </span>
            <RemoveCrossComponent 
                @remove="removeResource(idx)"
            />
        </li>

        <li
            class="cursor-pointer select-none"
            v-for="(diary, idx) in diaries" :key="`diary-${idx}`"
        >
            <span @click="validatedToggleDiary(idx)">
                <span :class="{'line-through': diary.lost}">{{diary.name}}</span>
                <span class="italic"> (diary - {{ memories(diary) }} of 4 memories)</span>
            </span>
            <RemoveCrossComponent 
                @remove="removeDiary(idx)"
            />
        </li>
    </ul>
  </CardComponent>
</template>
<HeadingComponent level="2">Marks</HeadingComponent>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';



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
    ...mapState('resources', ['resources', 'diaries']),
    ...mapGetters('resources', ['hasDiary']),
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

      this.addResource(this.newResource);
      this.toggleResourceControls();
    },
    validatedToggleDiary(idx) {
      this.hideNotification();

      if (this.hasDiary) {
        if (this.diaries[idx].lost ) {
          this.showNotification({message: 'You may only have one active diary.', type: 'warning'});
          return;
        } else if (this.memories(this.diaries[idx]) > 0) {
          this.showNotification({message: 'Please cross out existing memories before losing the diary.', type: 'warning'});
          return;
        }
      }

      this.toggleDiary(idx);
    },
    validatedAddDiary() {
      if (this.newDiary.name === '') {
        this.showNotification({message: 'You must provide a description.', type: 'warning'});
        return;
      } else if (this.hasDiary) {
        this.showNotification({message: 'You may only have one active diary.', type: 'warning'});
        return;
      }

      this.addDiary(this.newDiary);
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