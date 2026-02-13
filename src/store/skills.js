import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import entityFactory from 'Libs/entities/skills'
import { findById } from 'Libs/entities'

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    ...defaultGameState('skills'),
  }),
  getters: {
    sortedSkills: (state) =>
      [...state.skills].sort((a, b) => {
        if ((a.checked && b.checked) || (!a.checked && !b.checked)) {
          return a.name.localeCompare(b.name)
        }
      }),
  },
  actions: {
    add(skill) {
      this.skills.push(entityFactory(skill))
    },
    set(skills) {
      this.skills = skills
    },
    update(updated) {
      const found = findById(this.skills, updated.id)
      this.skills[found.idx] = entityFactory(updated)
    },
    remove(skill) {
      const found = findById(this.skills, skill.id)
      this.skills.splice(found.idx, 1)
    },
    toggle(skill) {
      const found = findById(this.skills, skill.id)
      this.skills[found.idx].checked = !this.skills[found.idx].checked
    },
  },
})
