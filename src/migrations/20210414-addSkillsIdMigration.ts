import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type SkillsMigrationData = MigrationData & {
  skills: Array<{ id?: string }>
}

const migration: Migration<SkillsMigrationData> = {
  description: 'Adds ID to skills.',
  requiredSignature: 1,
  migrate(data) {
    data.skills.forEach((skill) => {
      if (!skill.id) {
        skill.id = uuid('skill')
      }
    })

    return data
  },
}

export default migration
