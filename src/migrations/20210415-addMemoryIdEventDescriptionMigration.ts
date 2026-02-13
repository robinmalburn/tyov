import uuid from 'Libs/uuid'
import type { Migration, MigrationData } from './types'

type LegacyEvent =
  | string
  | { id?: string; description: string; memory?: string }

type MemoryEventMigrationData = MigrationData & {
  memories: Array<{
    id?: string
    events: LegacyEvent[]
  }>
}

const migration: Migration<MemoryEventMigrationData> = {
  description: 'Adds ID to memories and events.',
  requiredSignature: 1,
  migrate(data) {
    data.memories.forEach((memory) => {
      if (!memory.id) {
        memory.id = uuid('memory')
      }

      memory.events.forEach((event, idx, events) => {
        if (typeof event === 'string') {
          events[idx] = {
            description: event,
            id: uuid('event'),
          }
        }
      })
    })

    return data
  },
}

export default migration
