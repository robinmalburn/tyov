import { baseEntityFactory, type EntityWithId } from 'Libs/entities'

const MEMORY_NS = 'memory'
const EVENT_NS = 'event'

export type Memory = EntityWithId<{
  description: string
  forgotten: boolean
  diary: string
}>

export type Event = EntityWithId<{
  description: string
  memory: string
}>

export const memoryEntityFactory = (data: Partial<Memory> = {}): Memory => {
  return {
    description: '',
    forgotten: false,
    diary: '',
    ...baseEntityFactory(data, MEMORY_NS),
  }
}

export const eventEntityFactory = (data: Partial<Event> = {}): Event => {
  return {
    description: '',
    memory: '',
    ...baseEntityFactory(data, EVENT_NS),
  }
}
