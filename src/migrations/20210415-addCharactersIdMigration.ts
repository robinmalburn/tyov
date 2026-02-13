import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type CharactersMigrationData = MigrationData & {
  characters: Array<{ id?: string }>
}

const migration: Migration<CharactersMigrationData> = {
  description: 'Adds ID to characters.',
  requiredSignature: 1,
  migrate(data) {
    data.characters.forEach((character) => {
      if (!character.id) {
        character.id = uuid('character')
      }
    })

    return data
  },
}

export default migration
