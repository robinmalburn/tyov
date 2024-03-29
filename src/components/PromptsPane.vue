 <template>
  <CardComponent id="prompts">
  <HeadingComponent level="2">Prompts</HeadingComponent>

    <FormToggleComponent 
      @save="validatedAddPrompt"
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
            :key="`prompt-key-${prompt.id}`"
          >
              <div class="flex">
                <div class="flex-initial w-6 text-center">
                  <span
                    class="cursor-pointer select-none hover:text-gray-400"
                    title="Set as current prompt"
                    @click="makePromptCurrent(prompt)"
                    v-html="'&rarr;'"
                    v-show="prompt.page !== currentPrompt.page"
                  />
                </div>
                <div class="flex-initial w-6 text-center">
                  <span
                    class="cursor-pointer select-none hover:text-gray-400"
                    title="Remove prompt"
                    @click="removePrompt(prompt)"
                    v-html="'&times;'"
                    v-show="prompt.page !== currentPrompt.page"
                  />
                </div>
                <div class="flex-initial w-6 text-center">
                  <span 
                    class="cursor-pointer select-none hover:text-gray-400" 
                    title="Increment visits"
                    @click="incrementPrompt(prompt)"
                    v-html="'&plus;'"
                    v-show="prompt.count < 3"
                  />
                </div>
                <div class="flex-initial w-6 text-center">
                  <span 
                    class="cursor-pointer select-none hover:text-gray-400" 
                    title="Decrement visits"
                    @click="decrementPrompt(prompt)"
                    v-html="'&minus;'"
                    v-show="prompt.count > 1"
                  />
                </div>
                <div class="flex-initial">
                  <span 
                    class="select-none"
                    :class="{'text-red-700': prompt.page === currentPrompt.page}"
                  >
                    <span class="px-2">{{prompt.page}}:</span> 
                    <span v-html="tally(prompt.count)"/>
                  </span>
                </div>
              </div>
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
import entityFactory from 'Libs/entities/prompts';

export default {
  name: 'PromptsPane',
  data() {
    return {
      showControls: false,
      newPrompt: entityFactory({
        page: 1,
        count: 1,
      }),
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
          let page = prompt.page;
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
    ...mapActions('actions', ['makePromptCurrent', 'removePrompt']),
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    validatedAddPrompt() {
      const promptExists = this.prompts.some((prompt) => {
        return prompt.page === parseInt(this.newPrompt.page, 10);
      });

      if (promptExists) {
        this.showNotification({message: 'This prompt already exists, you cannot re-add it', type: 'warning'});
        return;
      }

      const prompt = {
        ...this.newPrompt,
      };

      prompt.page = parseInt(prompt.page, 10);

      this.addPrompt(prompt);

      if (this.makeCurrent) {
        this.makePromptCurrent(prompt)
      }

      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();

      this.showControls = !this.showControls;
      
      this.newPrompt = entityFactory({
        page: this.firstUnusedPrompt,
        count: 1,
      });

      this.makeCurrent = this.currentPrompt && this.currentPrompt.page ? false : true;
    }
  }
}
</script>