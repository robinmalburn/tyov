import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import { memoryEntityFactory, eventEntityFactory } from 'Libs/entities/memories'
import type { Diary } from 'Libs/entities/resources'
import type { Event, Memory } from 'Libs/entities/memories'
import { findById } from 'Libs/entities'

type MemoriesState = {
  memories: Memory[]
  events: Event[]
}

export const useMemoriesStore = defineStore('memories', {
  state: (): MemoriesState => defaultGameState('memories') as MemoriesState,
  getters: {
    active: (state: MemoriesState): number => {
      return state.memories.reduce((accumlator, current) => {
        if (current.forgotten === false && current.diary === '') {
          return accumlator + 1
        }
        return accumlator
      }, 0)
    },
    canAddMemories(): boolean {
      return this.active < 5
    },
    forgottenMemories: (state: MemoriesState): Memory[] =>
      state.memories.filter(
        (memory) => memory.forgotten && memory.diary === '',
      ),
    activeMemories: (state: MemoriesState): Memory[] =>
      state.memories.filter(
        (memory) => !memory.forgotten && memory.diary === '',
      ),
    sortedEvents:
      (state: MemoriesState) =>
      (memory: Memory): Event[] =>
        state.events.filter((event) => event.memory === memory.id),
    hasEvents:
      (state: MemoriesState) =>
      (memory: Memory): boolean =>
        state.events.some((event) => event.memory === memory.id),
  },
  actions: {
    addMemory(memory: Partial<Memory>) {
      this.memories.push(memoryEntityFactory(memory))
    },
    setMemories(memories: Memory[]) {
      this.memories = memories
    },
    updateMemory(memory: Partial<Memory> & { id: string }) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx] = memoryEntityFactory(memory)
    },
    removeMemory(memory: Memory) {
      const found = findById(this.memories, memory.id)
      this.memories.splice(found.idx, 1)
    },
    toggleMemory(memory: Memory) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].forgotten = !this.memories[found.idx].forgotten
    },
    addEvent(event: Partial<Event>) {
      this.events.push(eventEntityFactory(event))
    },
    setEvents(events: Event[]) {
      this.events = events
    },
    updateEvent(event: Partial<Event> & { id: string }) {
      const found = findById(this.events, event.id)
      this.events[found.idx] = eventEntityFactory(event)
    },
    removeEvent(event: Event) {
      const found = findById(this.events, event.id)
      this.events.splice(found.idx, 1)
    },
    diarise({ memory, diary }: { memory: Memory; diary: Diary }) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].diary = diary.id
    },
    undiarise(memory: Memory) {
      const found = findById(this.memories, memory.id)
      this.memories[found.idx].diary = ''
    },
  },
})
