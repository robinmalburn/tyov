import { defineStore } from "pinia";
import { defaultGameState } from "Libs/gameState";
import entityFactory from "Libs/entities/characters";
import { findById } from "Libs/entities";

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    ...defaultGameState("characters"),
  }),
  getters: {
    sortedCharacters: (state) =>
      [...state.characters].sort((a, b) => {
        if (a.dead && !b.dead) {
          return 1;
        }

        if (!a.dead && b.dead) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      }),
  },
  actions: {
    add(character) {
      this.characters.push(entityFactory(character));
    },
    update(update) {
      const found = findById(this.characters, update.id);
      this.characters[found.idx] = entityFactory(update);
    },
    set(characters) {
      this.characters = characters;
    },
    remove(character) {
      const found = findById(this.characters, character.id);
      this.characters.splice(found.idx, 1);
    },
    toggle(character) {
      const found = findById(this.characters, character.id);
      found.entity.dead = !found.entity.dead;
    },
  },
});
