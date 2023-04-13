<template>
    <SlideDownPanelComponent v-model="loading">
        <template #closed-heading>
            Load
        </template>
        <div class="grid grid-rows gap-1 my-2">
            <input 
                type="file"
                class="hidden"
                ref="upload"
                @change="load"
            />
            <ButtonComponent 
              class="w-full"
              @click="$refs.upload.click()"
            >
              From File
            </ButtonComponent>
            <ButtonComponent 
              class="w-full"
              @click="fromLocalStorage"
              v-if="supportsLocalStorage"
            >
              From Local Storage
            </ButtonComponent>
        </div>
    </SlideDownPanelComponent>
</template>

<script>
import ButtonComponent from './ButtonComponent';
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent';
import { restoreState, deserialize } from 'Libs/gameState';
import localStorage, { supportsLocalStorage } from 'Libs/localStorage';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'LoadMenuComponent',
  data() {
    return {
      loading: false,
    }
  },
  components: {
    ButtonComponent,
    SlideDownPanelComponent,
  },
  computed:{
    supportsLocalStorage,
  },
  methods: {
    ...mapMutations('notifications', ['hide']),
    ...mapActions('notifications', ['showNotification']),
    load(evt) {
      if (evt.target.files.length !== 1) { 
        this.showNotification({message: 'Unable to load file.  You must select one file to load.', type: 'warning'});
        return;
      }

      this.hide();

      const file = evt.target.files[0];

        const reader = new FileReader();
        
        reader.onload = () => {
          try {
            const data = deserialize(reader.result);
            restoreState(this.$store, data);
            this.loading = false;
          } catch(err) {
            this.showNotification({message: 'Unable to decode save state.', type:'danger'});
          }

        }

        reader.onerror = () => {
          this.showNotification({message: 'Unable to read file.', type:'danger'});
        }
        
        reader.readAsText(file);
    },
    fromLocalStorage() {
      this.hide();

      try {
        const data = deserialize(localStorage.get('save-game'));
        restoreState(this.$store, data);
      } catch(err) {
        this.showNotification({message: 'Unable to decode save state.', type:'danger'});
      }

      this.loading = false;
    },
  }
}
</script>