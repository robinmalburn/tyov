import { defineStore } from 'pinia'
import { randomRange } from '../lib/random'
import { defaultGameState } from '../lib/gameState'
import entityFactory, { type Prompt } from '../lib/entities/prompts'
import { findById } from '../lib/entities'

type ActionsState = {
  d6: number
  d10: number
  lastRoll: string
  currentPromptIdx: number
  prompts: Prompt[]
}

export const useActionsStore = defineStore('actions', {
  state: (): ActionsState => defaultGameState('actions') as ActionsState,
  getters: {
    die: (state: ActionsState): number => state.d10 - state.d6,
    currentRoll: (state: ActionsState): string => {
      const die = state.d10 - state.d6
      if (isNaN(die)) {
        return '?'
      }
      return `${die} (+${state.d10}, -${state.d6})`
    },
    sortedPrompts: (state: ActionsState): Prompt[] => {
      const prompts = [...state.prompts]
      prompts.sort((a, b) => (a.page > b.page ? -1 : 1))
      return prompts
    },
    currentPrompt: (state: ActionsState): Partial<Prompt> =>
      state.prompts[state.currentPromptIdx] ?? {},
  },
  actions: {
    rollD6() {
      this.d6 = randomRange(1, 6)
    },
    setD6(value: number) {
      this.d6 = value
    },
    setD10(value: number) {
      this.d10 = value
    },
    rollD10() {
      this.d10 = randomRange(1, 10)
    },
    saveRoll(roll: string) {
      this.lastRoll = roll
    },
    makePrompt(prompt: number) {
      this.prompts.push(entityFactory({ page: prompt, count: 0 }))
    },
    addPrompt(prompt: Partial<Prompt>) {
      this.prompts.push(entityFactory(prompt))
    },
    setPrompts(prompts: Prompt[]) {
      this.prompts = prompts
    },
    removePrompt(prompt: Prompt) {
      const found = findById(this.prompts, prompt.id)

      const current = this.currentPrompt

      this.prompts.splice(found.idx, 1)

      const currentFound = findById(this.prompts, current.id)

      this.currentPromptIdx = currentFound.idx
    },
    incrementPrompt(prompt: Prompt) {
      const found = findById(this.prompts, prompt.id)
      if (found && found.entity) {
        found.entity.count = (found.entity.count || 0) + 1
      }
    },
    decrementPrompt(prompt: Prompt) {
      const found = findById(this.prompts, prompt.id)
      if (found && found.entity) {
        found.entity.count = (found.entity.count || 0) - 1
      }
    },
    setCurrentPromptIdx(idx: number) {
      this.currentPromptIdx = idx
    },
    roll() {
      this.saveRoll(this.currentRoll)
      this.rollD6()
      this.rollD10()

      let newPrompt = (this.currentPrompt && this.currentPrompt.page) ?? 0
      newPrompt += this.die
      if (newPrompt <= 0) {
        newPrompt = 1
      }

      let promptIdx = this.currentPromptIdx
      const promptFound = this.prompts.some((prompt, idx) => {
        if (prompt.page === newPrompt) {
          promptIdx = idx
          if (prompt.count === 3) {
            promptIdx += 1
            newPrompt += 1
          }
          return true
        }
      })
      if (!promptFound) {
        promptIdx = this.prompts.length
      }
      let prompt = this.prompts[promptIdx]
      if (!prompt) {
        prompt = entityFactory({ page: newPrompt })
        this.addPrompt(prompt)
      }
      this.incrementPrompt(prompt)
      this.setCurrentPromptIdx(promptIdx)
    },
    makePromptCurrent(prompt: Prompt) {
      const found = findById(this.prompts, prompt.id)
      this.setCurrentPromptIdx(found.idx)
    },
  },
})
