import { defineStore } from 'pinia'
import { defaultGameState } from 'Libs/gameState'
import entityFactory, { type Character } from 'Libs/entities/characters'
import { findById } from 'Libs/entities'

type CharactersState = {
  characters: Character[]
}

export const useCharactersStore = defineStore('characters', {
  state: (): CharactersState =>
    defaultGameState('characters') as CharactersState,
  getters: {
    sortedCharacters: (state: CharactersState): Character[] =>
      [...state.characters].sort((a, b) => {
        if (a.dead && !b.dead) {
          return 1
        }

        if (!a.dead && b.dead) {
          return -1
        }

        return a.name.localeCompare(b.name)
      }),
  },
  actions: {
    add(character: Partial<Character>) {
      this.characters.push(entityFactory(character))
    },
    update(update: Partial<Character> & { id: string }) {
      const found = findById(this.characters, update.id)
      this.characters[found.idx] = entityFactory(update)
    },
    set(characters: Character[]) {
      this.characters = characters
    },
    remove(character: Character) {
      const found = findById(this.characters, character.id)
      this.characters.splice(found.idx, 1)
    },
    toggle(character: Character) {
      const found = findById(this.characters, character.id)
      found.entity.dead = !found.entity.dead
    },
  },
})
