<template>
  <CardComponent id="prompts">
  <HeadingComponent level="2">Prompts</HeadingComponent>


    <div class="divide-y divide-gray-200 divide-dashed" v-if="currentPrompt.name">
      <div class="text-red-700 my-2">
        <strong>Current:</strong> {{currentPrompt.name}} <span v-html="tally(currentPrompt.count)" />
      </div>
      <ol class="my-2 max-h-40 overflow-auto">
          <li
            v-for="(prompt) in prompts"
            :class="{'text-red-700': prompt.page === currentPrompt.page}"
            :key="`prompt-key-${prompt.page}`"
          >
              <span class="px-2">{{prompt.name}}</span> 
              <span v-html="tally(prompt.count)"/>
          </li>
      </ol>
    </div>
  
    
  </CardComponent>
</template>

<script>
import CardComponent from './CardComponent';
import HeadingComponent from './HeadingComponent';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'PromptsPane',
  components: {
    CardComponent,
    HeadingComponent,
  },
  computed: {
      ...mapState('actions', ['currentPromptPage']),
      ...mapGetters('actions', ['prompts', 'currentPrompt']),
      tally() {
          return (count) => {
              let tally = '';
              let char = '&omicron;';
              if (count >= 3) {
                char = '&oslash;';
              }

              for (let i = 0; i < count; i++) {
                  tally += char;
              }

              return tally;
          };
      }
  },
}
</script>