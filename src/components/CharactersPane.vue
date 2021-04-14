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
    
    <ul class="my-3">
        <li
            v-for="(character, idx) in characters"
            :key="`character-${idx}`"
        >
            <CardComponent>
                <div class="text-center">
                    <span
                        :class="{
                            'line-through': character.dead,
                            'text-red-700': character.immortal,
                            'font-bold': character.immortal,
                            'cursor-pointer': true,
                            'select-none': true,
                        }"
                        @click="toggle(idx)"
                    >
                        {{character.name}}
                    </span>
                    <RemoveCrossComponent 
                      @remove="remove(idx)"
                    />
                </div>
                <div>{{character.bio}}</div>
            </CardComponent>
        </li>
    </ul>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapActions, mapState } from 'vuex';

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
    ...mapState('characters', ['characters']),
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
    toggle(idx) {
        if (this.characters[idx].immortal) {
            return;
        }
        this.toggleCharacter(idx);
      },
      add(){
      if (this.newCharacter.name === '' || this.newCharacter.bio === '') {
        this.showNotification({message:'You must provide a name & bio.', type:'warning'});
        return;
      }
      
      this.addCharacter(this.newCharacter);
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