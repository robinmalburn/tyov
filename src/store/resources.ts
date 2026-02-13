import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import {
  resourceEntityFactory,
  diaryEntityFactory,
  type Diary,
  type Resource,
} from 'Libs/entities/resources'
import { findById } from 'Libs/entities'
import type { Memory } from 'Libs/entities/memories'
import { useMemoriesStore } from 'Stores/memories'

type ResourcesState = {
  resources: Resource[]
  diaries: Diary[]
}

export const useResourcesStore = defineStore('resources', {
  state: (): ResourcesState => defaultGameState('resources') as ResourcesState,
  getters: {
    sortedResources(state: ResourcesState): Resource[] {
      return [...state.resources].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
          return 1
        }
        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
          return -1
        }
        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name)
      })
    },
    sortedDiaries(state: ResourcesState): Diary[] {
      return [...state.diaries].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
          return 1
        }
        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
          return -1
        }
        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name)
      })
    },
    diary(state: ResourcesState): Diary | null {
      return state.diaries.filter((diary) => !diary.lost)[0] || null
    },
    lostDiaries(state: ResourcesState): Diary[] {
      return state.diaries.filter((diary) => diary.lost)
    },
    hasDiary(state: ResourcesState): boolean {
      return state.diaries.some((diary) => !diary.lost)
    },
    memories(): Memory[] {
      const memoriesStore = useMemoriesStore()
      return memoriesStore.memories.filter((memory) => {
        return memory.diary === this.diary?.id
      })
    },
    activeMemories(): Memory[] {
      return this.memories.filter((memory) => !memory.forgotten)
    },
    forgottenMemories(): Memory[] {
      return this.memories.filter((memory) => memory.forgotten)
    },
    isDiaryFull(): boolean {
      let count = 0
      return this.memories.some((memory) => {
        if (!(memory as { lost?: boolean }).lost) {
          count += 1
        }
        return count >= 4
      })
    },
  },
  actions: {
    addResource(resource: Partial<Resource>) {
      this.resources.push(resourceEntityFactory(resource))
    },
    setResources(resources: Resource[]) {
      this.resources = resources
    },
    updateResource(updated: Partial<Resource> & { id: string }) {
      const found = findById(this.resources, updated.id)
      this.resources[found.idx] = resourceEntityFactory(updated)
    },
    removeResource(resource: Resource) {
      const found = findById(this.resources, resource.id)
      this.resources.splice(found.idx, 1)
    },
    toggleResource(resource: Resource) {
      const found = findById(this.resources, resource.id)
      this.resources[found.idx].lost = !this.resources[found.idx].lost
    },
    addDiary(diary: Partial<Diary>) {
      this.diaries.push(diaryEntityFactory(diary))
    },
    updateDiary(updated: Partial<Diary> & { id: string }) {
      const found = findById(this.diaries, updated.id)
      this.diaries[found.idx] = diaryEntityFactory(updated)
    },
    setDiaries(diaries: Diary[]) {
      this.diaries = diaries
    },
    removeDiary(diary: Diary) {
      const found = findById(this.diaries, diary.id)
      this.diaries.splice(found.idx, 1)
    },
    toggleDiary(diary: Diary) {
      const found = findById(this.diaries, diary.id)
      this.diaries[found.idx].lost = !this.diaries[found.idx].lost
    },
  },
})
