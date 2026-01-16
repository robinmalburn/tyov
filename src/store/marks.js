import { defineStore } from "pinia";
import { defaultGameState } from "Libs/gameState";
import entityFactory from "Libs/entities/marks";
import { findById } from "Libs/entities";

export const useMarksStore = defineStore("marks", {
  state: () => ({
    ...defaultGameState("marks"),
  }),
  actions: {
    add(mark) {
      this.marks.push(entityFactory(mark));
    },
    update(updated) {
      const found = findById(this.marks, updated.id);
      this.marks[found.idx] = entityFactory(updated);
    },
    set(marks) {
      this.marks = marks;
    },
    remove(mark) {
      const found = findById(this.marks, mark.id);
      this.marks.splice(found.idx, 1);
    },
  },
});
