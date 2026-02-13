import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type ResourcesMigrationData = MigrationData & {
  resources: Array<{ id?: string }>
  diaries: Array<{ id?: string }>
}

const migration: Migration<ResourcesMigrationData> = {
  description: 'Adds ID to resources and diaries.',
  requiredSignature: 1,
  migrate(data) {
    data.resources.forEach((resource) => {
      if (!resource.id) {
        resource.id = uuid('resource')
      }
    })

    data.diaries.forEach((diary) => {
      if (!diary.id) {
        diary.id = uuid('diary')
      }
    })

    return data
  },
}

export default migration
