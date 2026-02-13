import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type MarksMigrationData = MigrationData & {
  marks: Array<string | { id?: string; description: string }>
}

const migration: Migration<MarksMigrationData> = {
  description: 'Adds ID & Description to marks.',
  requiredSignature: 1,
  migrate(data) {
    data.marks.forEach((mark, idx, marks) => {
      if (typeof mark === 'string') {
        marks[idx] = {
          id: uuid('mark'),
          description: mark,
        }
      }
    })

    return data
  },
}

export default migration
