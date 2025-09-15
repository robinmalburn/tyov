import { defineStore } from "pinia";
import { randomRange } from "../lib/random";
import { defaultGameState } from "../lib/gameState";
import entityFactory from "../lib/entities/prompts";
import { findById } from "../lib/entities";
export const useActionsStore = defineStore("actions", {
  state: () => ({
    ...defaultGameState("actions"),
  }),
  getters: {
    die: (state) => state.d10 - state.d6,
    currentRoll: (state) => {
      const die = state.d10 - state.d6;
      if (isNaN(die)) {
        return "?";
      }
      return `${die} (+${state.d10}, -${state.d6})`;
    },
    sortedPrompts: (state) => {
      const prompts = [...state.prompts];
      prompts.sort((a, b) => (a.page > b.page ? -1 : 1));
      return prompts;
    },
    currentPrompt: (state) => state.prompts[state.currentPromptIdx] ?? {},
  },
  actions: {
    rollD6() {
      this.d6 = randomRange(1, 6);
    },
    setD6(value) {
      this.d6 = value;
    },
    setD10(value) {
      this.d10 = value;
    },
    rollD10() {
      this.d10 = randomRange(1, 10);
    },
    saveRoll(roll) {
      this.lastRoll = roll;
    },
    makePrompt(prompt) {
      this.prompts.push(entityFactory({ page: prompt, count: 0 }));
    },
    addPrompt(prompt) {
      this.prompts.push(entityFactory(prompt));
    },
    setPrompts(prompts) {
      this.prompts = prompts;
    },
    removePrompt(prompt) {
      const found = findById(this.prompts, prompt.id);
      this.prompts.splice(found.idx, 1);
    },
    incrementPrompt(prompt) {
      const found = findById(this.prompts, prompt.id);
      if (found && found.entity) {
        found.entity.count = (found.entity.count || 0) + 1;
      }
    },
    decrementPrompt(prompt) {
      const found = findById(this.prompts, prompt.id);
      if (found && found.entity) {
        found.entity.count = (found.entity.count || 0) - 1;
      }
    },
    setCurrentPromptIdx(idx) {
      this.currentPromptIdx = idx;
    },
    roll() {
      this.saveRoll(this.currentRoll);
      this.rollD6();
      this.rollD10();

      let newPrompt = (this.currentPrompt && this.currentPrompt.page) ?? 0;
      newPrompt += this.die;
      if (newPrompt <= 0) {
        newPrompt = 1;
      }

      let promptIdx = this.currentPromptIdx;
      const promptFound = this.prompts.some((prompt, idx) => {
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
        promptIdx = this.prompts.length;
      }
      let prompt = this.prompts[promptIdx];
      if (!prompt) {
        prompt = entityFactory({ page: newPrompt });
        this.addPrompt(prompt);
      }
      this.incrementPrompt(prompt);
      this.setCurrentPromptIdx(promptIdx);
    },
    makePromptCurrent(prompt) {
      const found = findById(this.prompts, prompt.id);
      this.setCurrentPromptIdx(found.idx);
    },
    removePromptAndUpdateCurrent(prompt) {
      const currentPrompt = this.currentPrompt;
      this.removePrompt(prompt);
      const found = findById(this.prompts, currentPrompt.id);
      this.setCurrentPromptIdx(found.idx);
    },
  },
});
