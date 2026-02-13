import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import entityFactory, { type Mark } from 'Libs/entities/marks'
import { findById } from 'Libs/entities'

type MarksState = {
  marks: Mark[]
}

export const useMarksStore = defineStore('marks', {
  state: (): MarksState => defaultGameState('marks') as MarksState,
  actions: {
    add(mark: Partial<Mark>) {
      this.marks.push(entityFactory(mark))
    },
    update(updated: Partial<Mark> & { id: string }) {
      const found = findById(this.marks, updated.id)
      this.marks[found.idx] = entityFactory(updated)
    },
    set(marks: Mark[]) {
      this.marks = marks
    },
    remove(mark: Mark) {
      const found = findById(this.marks, mark.id)
      this.marks.splice(found.idx, 1)
    },
  },
})
