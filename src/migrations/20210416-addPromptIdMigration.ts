import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type PromptsMigrationData = MigrationData & {
  prompts: Array<{ id?: string; name?: string }>
}

const migration: Migration<PromptsMigrationData> = {
  description: 'Adds ID to prompts and removes name.',
  requiredSignature: 1,
  migrate(data) {
    data.prompts.forEach((prompt) => {
      if (!prompt.id) {
        prompt.id = uuid('prompt')
      }

      if (prompt.name) {
        delete prompt.name
      }
    })

    return data
  },
}

export default migration
