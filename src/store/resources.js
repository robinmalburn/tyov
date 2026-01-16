import { defineStore } from "pinia";
import { defaultGameState } from "Libs/gameState";
import {
  resourceEntityFactory,
  diaryEntityFactory,
} from "Libs/entities/resources";
import { findById } from "Libs/entities";
import { useMemoriesStore } from "Stores/memories";

export const useResourcesStore = defineStore("resources", {
  state: () => ({
    ...defaultGameState("resources"),
  }),
  getters: {
    sortedResources(state) {
      return [...state.resources].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
          return 1;
        }
        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
          return -1;
        }
        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name);
      });
    },
    sortedDiaries(state) {
      return [...state.diaries].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
          return 1;
        }
        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
          return -1;
        }
        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name);
      });
    },
    diary(state) {
      return state.diaries.filter((diary) => !diary.lost)[0] || null;
    },
    lostDiaries(state) {
      return state.diaries.filter((diary) => diary.lost);
    },
    hasDiary(state) {
      return state.diaries.some((diary) => !diary.lost);
    },
    memories() {
      const memoriesStore = useMemoriesStore();
      return memoriesStore.memories.filter((memory) => {
        return memory.diary === this.diary?.id;
      });
    },
    activeMemories() {
      return this.memories.filter((memory) => !memory.forgotten);
    },
    forgottenMemories() {
      return this.memories.filter((memory) => memory.forgotten);
    },
    isDiaryFull() {
      let count = 0;
      return this.memories.some((memory) => {
        if (!memory.lost) {
          count += 1;
        }
        return count >= 4;
      });
    },
  },
  actions: {
    addResource(resource) {
      this.resources.push(resourceEntityFactory(resource));
    },
    setResources(resources) {
      this.resources = resources;
    },
    updateResource(updated) {
      const found = findById(this.resources, updated.id);
      this.resources[found.idx] = resourceEntityFactory(updated);
    },
    removeResource(resource) {
      const found = findById(this.resources, resource.id);
      this.resources.splice(found.idx, 1);
    },
    toggleResource(resource) {
      const found = findById(this.resources, resource.id);
      this.resources[found.idx].lost = !this.resources[found.idx].lost;
    },
    addDiary(diary) {
      this.diaries.push(diaryEntityFactory(diary));
    },
    updateDiary(updated) {
      const found = findById(this.diaries, updated.id);
      this.diaries[found.idx] = diaryEntityFactory(updated);
    },
    setDiaries(diaries) {
      this.diaries = diaries;
    },
    removeDiary(diary) {
      const found = findById(this.diaries, diary.id);
      this.diaries.splice(found.idx, 1);
    },
    toggleDiary(diary) {
      const found = findById(this.diaries, diary.id);
      this.diaries[found.idx].lost = !this.diaries[found.idx].lost;
    },
  },
});
