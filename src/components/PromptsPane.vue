<template>
  <CardComponent id="prompts">
    <HeadingComponent level="2">Prompts</HeadingComponent>

    <FormToggleComponent
      @save="validatedAddPrompt"
      @toggle="toggleControls"
      :showControls="showControls"
    >
      <template #button> Manually add Prompt? </template>
      <template #form>
        <div class="grid grid-rows md:grid-cols-2 gap-2">
          <div class="grid grid grid-rows gap-2">
            <label for="new-propt-number"> Prompt Number: </label>
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
            <label for="new-prompt-count"> Times visited: </label>
            <select
              id="new-prompt-count"
              class="w-full shadow border rounded py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newPrompt.count"
            >
              <option v-for="i in [1, 2, 3]" :key="`visits-${i}`" :value="i">
                {{ i }}
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

    <div
      class="divide-y divide-gray-200 divide-dashed"
      v-if="store.currentPrompt.page"
    >
      <div class="text-red-700 my-2">
        <strong>Current:</strong> {{ store.currentPrompt.page }}:
        <span v-html="tally(store.currentPrompt.count)" />
      </div>
      <ol class="my-2 max-h-40 overflow-auto">
        <li
          class="select-none"
          v-for="prompt in store.sortedPrompts"
          :key="`prompt-key-${prompt.id}-${prompt.count}`"
        >
          <div class="flex">
            <div class="flex-initial w-6 text-center">
              <span
                class="cursor-pointer select-none hover:text-gray-400"
                title="Set as current prompt"
                @click="store.makePromptCurrent(prompt)"
                v-html="'&rarr;'"
                v-show="prompt.page !== store.currentPrompt.page"
              />
            </div>
            <div class="flex-initial w-6 text-center">
              <span
                class="cursor-pointer select-none hover:text-gray-400"
                title="Remove prompt"
                @click="store.removePrompt(prompt)"
                v-html="'&times;'"
                v-show="prompt.page !== store.currentPrompt.page"
              />
            </div>
            <div class="flex-initial w-6 text-center">
              <span
                class="cursor-pointer select-none hover:text-gray-400"
                title="Increment visits"
                @click="store.incrementPrompt(prompt)"
                v-html="'&plus;'"
                v-show="prompt.count < 3"
              />
            </div>
            <div class="flex-initial w-6 text-center">
              <span
                class="cursor-pointer select-none hover:text-gray-400"
                title="Decrement visits"
                @click="store.decrementPrompt(prompt)"
                v-html="'&minus;'"
                v-show="prompt.count > 1"
              />
            </div>
            <div class="flex-initial">
              <span
                class="select-none"
                :class="{
                  'text-red-700': prompt.page === store.currentPrompt.page,
                }"
              >
                <span class="px-2">{{ prompt.page }}:</span>
                <span v-html="tally(prompt.count)" />
              </span>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </CardComponent>
</template>

<script setup>
import CardComponent from "Components/CardComponent";
import FormToggleComponent from "Components/FormToggleComponent";
import HeadingComponent from "Components/HeadingComponent";
import { ref, computed, watch } from "vue";
import entityFactory from "Libs/entities/prompts";
import { useActionsStore } from "Stores/actions";
import { useNotificationsStore } from "Stores/notifications";

const store = useActionsStore();
const notificationsStore = useNotificationsStore();

const showControls = ref(false);
const newPrompt = ref(
  entityFactory({
    page: 1,
    count: 1,
  })
);
const makeCurrent = ref(false);

const tally = computed(() => {
  return (count) => {
    let tally = "";
    let char = "&omicron;";
    if (count >= 3) {
      char = "&oslash;";
    }

    for (let i = 0; i < count; i++) {
      tally += char;
    }

    return tally;
  };
});
const firstUnusedPrompt = computed(() => {
  var unused = 1;

  if (!store.sortedPrompts.length) {
    return unused;
  }

  const prompts = [...store.sortedPrompts];
  prompts.sort((a, b) => (a.page > b.page ? 1 : -1));

  prompts.some((prompt) => {
    let page = prompt.page;
    if (page > unused) {
      return true;
    }

    unused = page + 1;

    return false;
  });

  return unused;
});

const validatedAddPrompt = () => {
  const promptExists = store.sortedPrompts.some((prompt) => {
    return prompt.page === parseInt(newPrompt.value.page, 10);
  });

  if (promptExists) {
    notificationsStore.showNotification({
      message: "This prompt already exists, you cannot re-add it",
      type: "warning",
    });
    return;
  }

  const prompt = {
    ...newPrompt.value,
  };

  prompt.page = parseInt(prompt.page, 10);

  store.addPrompt(prompt);

  if (makeCurrent.value) {
    store.makePromptCurrent(prompt);
  }

  toggleControls();
};

const toggleControls = () => {
  notificationsStore.hide();

  showControls.value = !showControls.value;

  newPrompt.value = entityFactory({
    page: firstUnusedPrompt.value,
    count: 1,
  });

  makeCurrent.value =
    store.currentPrompt && store.currentPrompt.page ? false : true;
};
</script>
