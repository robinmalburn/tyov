 <template>
  <CardComponent id="prompts">
  <HeadingComponent level="2">Prompts</HeadingComponent>

    <FormToggleComponent 
      @save="addValidatedPrompt"
      @toggle="toggleControls"
      :showControls="showControls"
    >
      <template #button>
        Manually add Prompt?
      </template>
      <template #form>
        <div class="grid grid-rows md:grid-cols-2 gap-2">
          <div class="grid grid grid-rows gap-2">
            <label for="new-propt-number">
              Prompt Number:
            </label>
            <input
              id="new-prompt-number"
              type="number"
              step="1"
              class="w-full shadow border rounded py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newPrompt.page"
              :min="firstUnusedPrompt"
            />
          </div>
          <div class="grid grid grid-rows gap-2">
            <label for="new-prompt-count">
              Times visited:
            </label>
            <select
              id="new-prompt-count"
              class="w-full shadow border rounded py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newPrompt.count"
            >
              <option 
                v-for="i in [1,2,3]"
                :key="`visits-${i}`"
                :value="i"
              >
                {{i}}
              </option>
            </select>
          </div>
        </div>
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="makeCurrent"
              :true-value="true"
              :false-value="false"
          />
          Current?
        </label>
      </template>
    </FormToggleComponent>

    <div class="divide-y divide-gray-200 divide-dashed" v-if="currentPrompt.page">
      <div class="text-red-700 my-2">
        <strong>Current:</strong> {{currentPrompt.page}}: <span v-html="tally(currentPrompt.count)" />
      </div>
      <ol class="my-2 max-h-40 overflow-auto">
          <li
            class="select-none"
            v-for="(prompt) in prompts"
            :key="`prompt-key-${prompt.page}`"
          >
              <span class="mr-4">
                <span 
                  class="cursor-pointer mx-2" 
                  :class="{'mr-4':prompt.count === 1}"
                  @click="incrementPrompt(prompt)"
                  v-show="prompt.count < 3"
                >
                  +
                </span>
                <span 
                  class="cursor-pointer select-none"
                  :class="{'ml-8':prompt.count >= 3}"
                  @click="decrementPrompt(prompt)"
                  v-show="prompt.count > 1"
                >
                  -
                </span>
              </span>
              <span :class="{'text-red-700': prompt.page === currentPrompt.page, 'select-none': true}">
                <span class="px-2">{{prompt.page}}:</span> 
                <span v-html="tally(prompt.count)"/>
              </span>

          </li>
      </ol>
    </div>
  
    
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import HeadingComponent from 'Components/HeadingComponent';
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import uuid from 'Libs/uuid';

export default {
  name: 'PromptsPane',
  data() {
    return {
      showControls: false,
      newPrompt: {
        page: this.firstUnusedPrompt,
        count: 1,
      },
      makeCurrent: this.currentPrompt && this.currentPrompt.page ? false : true
    };
  },
  components: {
    CardComponent,
    FormToggleComponent,
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
      },
      firstUnusedPrompt() {
        var unused = 1;

        if (!this.prompts.length) {
          return unused;
        }

        const prompts = [...this.prompts];
        prompts.sort((a, b) => a.page > b.page ? 1 : -1);

        prompts.some((prompt) => {
          let page = parseInt(prompt.page, 10)
          if (page > unused) {
            return true;
          }

          unused = page + 1;
          
          return false;
        });

        return unused;
      }
  },
  methods: {
    ...mapMutations('actions', ['addPrompt', 'incrementPrompt', 'decrementPrompt']),
    ...mapActions('actions', ['makePromptCurrent']),
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    addValidatedPrompt() {
      const promptExists = this.prompts.some((prompt) => {
        return parseInt(prompt.page,10) === parseInt(this.newPrompt.page, 10);
      });

      if (promptExists) {
        this.showNotification({message: 'This prompt already exists, you cannot re-add it', type: 'warning'});
        return;
      }

      const prompt = {
        id: uuid('prompt'),
        ...this.newPrompt,
      };

      this.addPrompt(prompt);

      if (this.makeCurrent) {
        this.makePromptCurrent(prompt)
      }

      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();

      this.showControls = !this.showControls;
      this.newPrompt = {
        page: this.firstUnusedPrompt,
        count: 1,
      };
      this.makeCurrent = this.currentPrompt && this.currentPrompt.page ? false : true;
    }
  }
}
</script>