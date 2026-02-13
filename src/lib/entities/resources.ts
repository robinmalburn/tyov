import { baseEntityFactory, type EntityWithId } from 'Libs/entities'

const RESOURCE_NS = 'resource'
const DIARY_NS = 'diary'

export type Resource = EntityWithId<{
  name: string
  lost: boolean
  stationary: boolean
}>

export type Diary = EntityWithId<{
  name: string
  lost: boolean
}>

export const resourceEntityFactory = (
  data: Partial<Resource> = {},
): Resource => {
  return {
    name: '',
    lost: false,
    stationary: false,
    ...baseEntityFactory(data, RESOURCE_NS),
  }
}

export const diaryEntityFactory = (data: Partial<Diary> = {}): Diary => {
  return {
    name: '',
    lost: false,
    ...baseEntityFactory(data, DIARY_NS),
  }
}
