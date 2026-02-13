import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import migrator from 'Migrations'
import {
  SIGNATURE,
  defaultGameState,
  getStateFromStore,
  restoreState,
  serialize,
  deserialize,
} from 'Libs/gameState'
import { useActionsStore } from 'Stores/actions'
import { useCharactersStore } from 'Stores/characters'
import { useMarksStore } from 'Stores/marks'
import { useMemoriesStore } from 'Stores/memories'
import { useResourcesStore } from 'Stores/resources'
import { useSkillsStore } from 'Stores/skills'

vi.mock('Migrations', () => {
  return {
    __esModule: true,
    default: {
      migrate: vi.fn(),
    },
  }
})

const migrateMock = vi.mocked(migrator.migrate)

const STATE = {
  actions: {
    d6: NaN,
    d10: NaN,
    lastRoll: '?',
    currentPromptIdx: 0,
    prompts: [],
  },
  characters: {
    characters: [],
  },
  marks: {
    marks: [],
  },
  memories: {
    memories: [],
    events: [],
  },
  skills: {
    skills: [],
  },
  resources: {
    resources: [],
    diaries: [],
  },
}

const serializedDataProvider = (): Array<[unknown, string]> => {
  return [
    ['foo', 'IgBmAG8AbwAiAA=='],
    [1, 'MQA='],
    [true, 'dAByAHUAZQA='],
    [{ foo: 'bar' }, 'ewAiAGYAbwBvACIAOgAiAGIAYQByACIAfQA='],
  ]
}

describe('lib/gameState.js', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    migrateMock.mockImplementation(async (data) => data)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('Has the expected signature.', () => {
    expect(SIGNATURE).toEqual(2)
  })

  it('Can return a default game state, or slices of it.', () => {
    const expectedState = {
      ...STATE.actions,
      ...STATE.characters,
      ...STATE.marks,
      ...STATE.memories,
      ...STATE.resources,
      ...STATE.skills,
    }

    const result = defaultGameState()
    expect(result).toEqual(expectedState)
  })

  it.each([
    ['foo', {}],
    ['actions', STATE.actions],
    ['characters', STATE.characters],
    ['marks', STATE.marks],
    ['memories', STATE.memories],
    ['resources', STATE.resources],
    ['skills', STATE.skills],
  ])(
    'Can return a section of default state, or an empty dictionary if an invalid section is requested.',
    (section, expectedState) => {
      const result = defaultGameState(section)
      expect(result).toEqual(expectedState)
    },
  )

  it('Can get state from a store.', () => {
    const actionsStore = useActionsStore()
    const charactersStore = useCharactersStore()
    const marksStore = useMarksStore()
    const memoriesStore = useMemoriesStore()
    const resourcesStore = useResourcesStore()
    const skillsStore = useSkillsStore()

    // Set up default state
    actionsStore.d6 = STATE.actions.d6
    actionsStore.d10 = STATE.actions.d10
    actionsStore.lastRoll = STATE.actions.lastRoll
    actionsStore.currentPromptIdx = STATE.actions.currentPromptIdx
    actionsStore.prompts = STATE.actions.prompts
    charactersStore.characters = STATE.characters.characters
    marksStore.marks = STATE.marks.marks
    memoriesStore.memories = STATE.memories.memories
    memoriesStore.events = STATE.memories.events
    resourcesStore.resources = STATE.resources.resources
    resourcesStore.diaries = STATE.resources.diaries
    skillsStore.skills = STATE.skills.skills

    const expected = {
      ...STATE.actions,
      ...STATE.characters,
      ...STATE.marks,
      ...STATE.memories,
      ...STATE.resources,
      ...STATE.skills,
      __SIGNATURE__: SIGNATURE,
    }

    const result = getStateFromStore()

    expect(result).toEqual(expected)
  })

  it('Can restore state to a store.', async () => {
    const actionsStore = useActionsStore()
    const charactersStore = useCharactersStore()
    const marksStore = useMarksStore()
    const memoriesStore = useMemoriesStore()
    const resourcesStore = useResourcesStore()
    const skillsStore = useSkillsStore()

    const saveRollSpy = vi.spyOn(actionsStore, 'saveRoll')
    const setD6Spy = vi.spyOn(actionsStore, 'setD6')
    const setD10Spy = vi.spyOn(actionsStore, 'setD10')
    const setCurrentPromptIdxSpy = vi.spyOn(actionsStore, 'setCurrentPromptIdx')
    const setPromptsSpy = vi.spyOn(actionsStore, 'setPrompts')
    const setCharactersSpy = vi.spyOn(charactersStore, 'set')
    const setMarksSpy = vi.spyOn(marksStore, 'set')
    const setMemoriesSpy = vi.spyOn(memoriesStore, 'setMemories')
    const setEventsSpy = vi.spyOn(memoriesStore, 'setEvents')
    const setResourcesSpy = vi.spyOn(resourcesStore, 'setResources')
    const setDiariesSpy = vi.spyOn(resourcesStore, 'setDiaries')
    const setSkillsSpy = vi.spyOn(skillsStore, 'set')

    const data = {}

    await restoreState(data)

    expect(migrateMock).toHaveBeenCalled()
    expect(saveRollSpy).toHaveBeenCalledWith(STATE.actions.lastRoll)
    expect(setD6Spy).toHaveBeenCalledWith(STATE.actions.d6)
    expect(setD10Spy).toHaveBeenCalledWith(STATE.actions.d10)
    expect(setCurrentPromptIdxSpy).toHaveBeenCalledWith(
      STATE.actions.currentPromptIdx,
    )
    expect(setPromptsSpy).toHaveBeenCalledWith(STATE.actions.prompts)
    expect(setCharactersSpy).toHaveBeenCalledWith(STATE.characters.characters)
    expect(setMarksSpy).toHaveBeenCalledWith(STATE.marks.marks)
    expect(setMemoriesSpy).toHaveBeenCalledWith(STATE.memories.memories)
    expect(setEventsSpy).toHaveBeenCalledWith(STATE.memories.events)
    expect(setResourcesSpy).toHaveBeenCalledWith(STATE.resources.resources)
    expect(setDiariesSpy).toHaveBeenCalledWith(STATE.resources.diaries)
    expect(setSkillsSpy).toHaveBeenCalledWith(STATE.skills.skills)
  })

  it('Can restore state to a store, with existing data.', async () => {
    const actionsStore = useActionsStore()
    const charactersStore = useCharactersStore()
    const marksStore = useMarksStore()
    const memoriesStore = useMemoriesStore()
    const resourcesStore = useResourcesStore()
    const skillsStore = useSkillsStore()

    const saveRollSpy = vi.spyOn(actionsStore, 'saveRoll')
    const setD6Spy = vi.spyOn(actionsStore, 'setD6')
    const setD10Spy = vi.spyOn(actionsStore, 'setD10')
    const setCurrentPromptIdxSpy = vi.spyOn(actionsStore, 'setCurrentPromptIdx')
    const setPromptsSpy = vi.spyOn(actionsStore, 'setPrompts')
    const setCharactersSpy = vi.spyOn(charactersStore, 'set')
    const setMarksSpy = vi.spyOn(marksStore, 'set')
    const setMemoriesSpy = vi.spyOn(memoriesStore, 'setMemories')
    const setEventsSpy = vi.spyOn(memoriesStore, 'setEvents')
    const setResourcesSpy = vi.spyOn(resourcesStore, 'setResources')
    const setDiariesSpy = vi.spyOn(resourcesStore, 'setDiaries')
    const setSkillsSpy = vi.spyOn(skillsStore, 'set')

    const data = {
      d6: 1,
      d10: 2,
      lastRoll: '3',
      currentPromptIdx: 4,
      prompts: [
        { page: 5, count: 1 },
        { page: 6, count: 2 },
      ],
    }

    await restoreState(data)

    expect(migrateMock).toHaveBeenCalled()
    expect(saveRollSpy).toHaveBeenCalledWith(data.lastRoll)
    expect(setD6Spy).toHaveBeenCalledWith(data.d6)
    expect(setD10Spy).toHaveBeenCalledWith(data.d10)
    expect(setCurrentPromptIdxSpy).toHaveBeenCalledWith(data.currentPromptIdx)
    expect(setPromptsSpy).toHaveBeenCalledWith(data.prompts)
    expect(setCharactersSpy).toHaveBeenCalledWith(STATE.characters.characters)
    expect(setMarksSpy).toHaveBeenCalledWith(STATE.marks.marks)
    expect(setMemoriesSpy).toHaveBeenCalledWith(STATE.memories.memories)
    expect(setEventsSpy).toHaveBeenCalledWith(STATE.memories.events)
    expect(setResourcesSpy).toHaveBeenCalledWith(STATE.resources.resources)
    expect(setDiariesSpy).toHaveBeenCalledWith(STATE.resources.diaries)
    expect(setSkillsSpy).toHaveBeenCalledWith(STATE.skills.skills)
  })

  it.each<[unknown, string]>(serializedDataProvider())(
    'Can serialize data into base64.',
    (input, output) => {
      const spyStringify = vi.spyOn(JSON, 'stringify')
      const spyBtoA = vi.spyOn(global, 'btoa')

      const result = serialize(input)

      expect(result).toEqual(output)
      expect(spyStringify).toHaveBeenCalledWith(input)
      expect(spyBtoA).toHaveBeenCalled()
    },
  )

  it('Throws on failure to serialize.', () => {
    const input = 'foo'
    const spyStringify = vi.spyOn(JSON, 'stringify')
    const spyBtoA = vi.spyOn(global, 'btoa')

    spyStringify.mockImplementation(() => {
      throw 'Fail'
    })

    expect(() => {
      serialize(input)
    }).toThrow('Unable to serialize data structure.')

    expect(spyStringify).toHaveBeenCalledWith(input)
    expect(spyBtoA).not.toHaveBeenCalled()
  })

  it.each<[unknown, string]>(serializedDataProvider())(
    'Can deserialize data from base64.',
    (output, input) => {
      const spyParse = vi.spyOn(JSON, 'parse')
      const spyAtoB = vi.spyOn(global, 'atob')

      const result = deserialize(input)

      expect(result).toEqual(output)
      expect(spyParse).toHaveBeenCalled()
      expect(spyAtoB).toHaveBeenCalledWith(input)
    },
  )

  it('Throws on failure to deserialize.', () => {
    const spyParse = vi.spyOn(JSON, 'parse')
    const spyAtoB = vi.spyOn(global, 'atob')

    spyParse.mockImplementation(() => {
      throw 'Fail'
    })

    expect(() => {
      deserialize('foo')
    }).toThrow('Unable to parse deserialised data.')

    expect(spyParse).toHaveBeenCalled()
    expect(spyAtoB).toHaveBeenCalledWith('foo')
  })
})
