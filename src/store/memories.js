import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import { memoryEntityFactory, eventEntityFactory } from 'Libs/entities/memories'
import { findById } from 'Libs/entities'

export const useMemoriesStore = defineStore('memories', {
  state: () => ({
    ...defaultGameState('memories'),
  }),
  getters: {
    active: (state) => {
      return state.memories.reduce((accumlator, current) => {
        if (current.forgotten === false && current.diary === '') {
          return accumlator + 1
        }
        return accumlator
      }, 0)
    },
    canAddMemories: (state) => state.active < 5,
    forgottenMemories: (state) =>
      state.memories.filter(
        (memory) => memory.forgotten && memory.diary === '',
      ),
    activeMemories: (state) =>
      state.memories.filter(
        (memory) => !memory.forgotten && memory.diary === '',
      ),
    sortedEvents: (state) => (memory) =>
      state.events.filter((event) => event.memory === memory.id),
    hasEvents: (state) => (memory) =>
      state.events.some((event) => event.memory === memory.id),
  },
  actions: {
    addMemory(memory) {
      this.memories.push(memoryEntityFactory(memory))
    },
    setMemories(memories) {
      this.memories = memories
    },
    updateMemory(memory) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx] = memoryEntityFactory(memory)
    },
    removeMemory(memory) {
      const found = findById(this.memories, memory.id)
      this.memories.splice(found.idx, 1)
    },
    toggleMemory(memory) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].forgotten = !this.memories[found.idx].forgotten
    },
    addEvent(event) {
      this.events.push(eventEntityFactory(event))
    },
    setEvents(events) {
      this.events = events
    },
    updateEvent(event) {
      const found = findById(this.events, event.id)
      this.events[found.idx] = eventEntityFactory(event)
    },
    removeEvent(event) {
      const found = findById(this.events, event.id)
      this.events.splice(found.idx, 1)
    },
    diarise({ memory, diary }) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].diary = diary.id
    },
    undiarise(memory) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].diary = ''
    },
  },
})
