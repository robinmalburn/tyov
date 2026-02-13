import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import entityFactory, { type Skill } from 'Libs/entities/skills'
import { findById } from 'Libs/entities'

type SkillsState = {
  skills: Skill[]
}

export const useSkillsStore = defineStore('skills', {
  state: (): SkillsState => defaultGameState('skills') as SkillsState,
  getters: {
    sortedSkills: (state: SkillsState): Skill[] =>
      [...state.skills].sort((a, b) => {
        if ((a.checked && b.checked) || (!a.checked && !b.checked)) {
          return a.name.localeCompare(b.name)
        }
        return 0
      }),
  },
  actions: {
    add(skill: Partial<Skill>) {
      this.skills.push(entityFactory(skill))
    },
    set(skills: Skill[]) {
      this.skills = skills
    },
    update(updated: Partial<Skill> & { id: string }) {
      const found = findById(this.skills, updated.id)
      this.skills[found.idx] = entityFactory(updated)
    },
    remove(skill: Skill) {
      const found = findById(this.skills, skill.id)
      this.skills.splice(found.idx, 1)
    },
    toggle(skill: Skill) {
      const found = findById(this.skills, skill.id)
      this.skills[found.idx].checked = !this.skills[found.idx].checked
    },
  },
})
