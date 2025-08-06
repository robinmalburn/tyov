import { randomRange } from "Libs/random";
import { defaultGameState } from "Libs/gameState";
import entityFactory from "Libs/entities/prompts";
import { findById } from "Libs/entities";
import Vue from "vue";
import { defineStore } from "pinia";

export const useActionsStore = defineStore("actions", {
  state: () => ({
    ...defaultGameState("actions"),
  }),
  getters: {
    die: (state) => state.d10 - state.d6,
    currentRoll: (state) => {
      if (isNaN(this.die)) {
        return "?";
      }

      return `${this.die} (+${state.d10}, -${state.d6})`;
    },
    sortedPrompts: (state) => {
      const prompts = [...state.prompts];

      prompts.sort((a, b) => (a.page > b.page ? -1 : 1));

      return prompts;
    },
    currentPrompt: (state) => state.prompts[state.currentPromptIdx] ?? {},
  },
});

const mutations = {
  rollD6: (state) => (state.d6 = randomRange(1, 6)),
  setD6: (state, value) => (state.d6 = value),
  setD10: (state, value) => (state.d10 = value),
  rollD10: (state) => (state.d10 = randomRange(1, 10)),
  saveRoll: (state, roll) => (state.lastRoll = roll),
  makePrompt: (state, prompt) =>
    state.prompts.push(entityFactory({ page: prompt, count: 0 })),
  addPrompt: (state, prompt) => state.prompts.push(entityFactory(prompt)),
  setPrompts: (state, prompts) => (state.prompts = prompts),
  removePrompt: (state, prompt) => {
    const found = findById(state.prompts, prompt.id);
    state.prompts.splice(found.idx, 1);
  },
  incrementPrompt: (state, prompt) => {
    const found = findById(state.prompts, prompt.id);
    Vue.set(found.entity, "count", found.entity.count + 1);
  },
  decrementPrompt: (state, prompt) => {
    const found = findById(state.prompts, prompt.id);
    Vue.set(found.entity, "count", found.entity.count - 1);
  },
  setCurrentPromptIdx: (state, idx) => (state.currentPromptIdx = idx),
};

const actions = {
  roll: ({ commit, getters, state }) => {
    commit("saveRoll", getters.currentRoll);
    commit("rollD6");
    commit("rollD10");

    let newPrompt = (getters.currentPrompt && getters.currentPrompt.page) ?? 0;

    newPrompt += getters.die;

    if (newPrompt <= 0) {
      newPrompt = 1;
    }

    var promptIdx = state.currentPromptIdx;

    const promptFound = state.prompts.some((prompt, idx) => {
      if (prompt.page === newPrompt) {
        promptIdx = idx;
        if (prompt.count === 3) {
          promptIdx += 1;
          newPrompt += 1;
        }
        return true;
      }
    });

    if (!promptFound) {
      promptIdx = state.prompts.length;
    }

    var prompt = state.prompts[promptIdx];

    if (!prompt) {
      prompt = entityFactory({ page: newPrompt });
      commit("addPrompt", prompt);
    }

    commit("incrementPrompt", prompt);
    commit("setCurrentPromptIdx", promptIdx);
  },
  makePromptCurrent({ commit, state }, prompt) {
    const found = findById(state.prompts, prompt.id);
    commit("setCurrentPromptIdx", found.idx);
  },
  removePrompt({ commit, getters, state }, prompt) {
    const currentPrompt = getters.currentPrompt;

    commit("removePrompt", prompt);

    const found = findById(state.prompts, currentPrompt.id);

    commit("setCurrentPromptIdx", found.idx);
  },
};
