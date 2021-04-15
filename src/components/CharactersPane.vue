<template>
  <CardComponent id="characters">
    <HeadingComponent level="2">Characters</HeadingComponent>

    <FormToggleComponent 
      @save="add"
      @toggle="toggleControls"
      :showControls="showControls"
    >
      <template #button>
        Add a new Character?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Name"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newCharacter.name"
          @keyup.enter="add"
        />
        <textarea 
            placeholder="Bio"
            class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200 resize-none"
            v-model="newCharacter.bio"
        />
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newCharacter.immortal"
              :true-value="true"
              :false-value="false"
          />
          Immortal?
        </label>
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newCharacter.dead"
              :true-value="true"
              :false-value="false"
          />
          Dead?
        </label>
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
      <li
        v-for="character in characters"
        :key="`character-${character.id}`"
        >
          <CardComponent :class="{'bg-red-50': character.immortal}">
            <div class="flex border-b mb-2">
              <HeadingComponent
                :class="{
                  'flex-1': true,
                  'line-through': character.dead,
                  'cursor-pointer': true,
                  'select-none': true,
                }"
                level="6"
                @click="toggle(character)"
              >
                {{ character.name }}
                <span v-if="character.immortal">(Immortal)</span>
              </HeadingComponent>
              <div class="flex-initial text-right">
                <RemoveCrossComponent @remove="remove(character)" />
            </div>
          </div>
          <div>{{character.bio}}</div>
          </CardComponent>
        </li>
    </transition-group>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapActions, mapGetters, } from 'vuex';
import uuid from 'Libs/uuid';


export default {
  name: 'CharactersPane',
  data: function() {
      return {
          showControls: false,
          newCharacter: {
            name: '',
            dead: false,
            immortal: false,
            bio: '',
          },
      }
  },
  components: {
      CardComponent,
      FormToggleComponent,
      HeadingComponent,
      RemoveCrossComponent,
  },
  computed: {
    ...mapGetters('characters', ['characters']),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('characters', {
      addCharacter: 'add',
      remove: 'remove',
      toggleCharacter: 'toggle',
    }),
    toggle(character) {
        if (character.immortal) {
            return;
        }
        this.toggleCharacter(character);
      },
      add(){
      if (this.newCharacter.name === '' || this.newCharacter.bio === '') {
        this.showNotification({message:'You must provide a name & bio.', type:'warning'});
        return;
      }
      
      this.addCharacter({
        id: uuid('character'),
        ...this.newCharacter
      });
      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newCharacter = {
            name: '',
            bio: '',
            dead: false,
            immortal: false,
          };
    },
  }
}
</script>