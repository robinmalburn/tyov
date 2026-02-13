import { baseEntityFactory, type EntityWithId } from 'Libs/entities'

const NS = 'character'

export type Character = EntityWithId<{
  name: string
  dead: boolean
  immortal: boolean
  bio: string
}>

export default (data: Partial<Character> = {}): Character => {
  return {
    name: '',
    dead: false,
    immortal: false,
    bio: '',
    ...baseEntityFactory(data, NS),
  }
}
