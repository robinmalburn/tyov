import { describe, it, expect, vi, afterEach } from 'vitest'
import { baseEntityFactory } from 'Libs/entities'
import characters from 'Libs/entities/characters'

vi.mock('Libs/entities')

const baseEntityFactoryMock = vi.mocked(baseEntityFactory)

describe('lib/entities/characters.js', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('Can create a default character entity.', () => {
    const character = characters()

    expect(character.name).toEqual('')
    expect(character.dead).toEqual(false)
    expect(character.immortal).toEqual(false)
    expect(character.bio).toEqual('')
    expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, 'character')
  })

  it('Can create a character entity with injected data.', () => {
    baseEntityFactoryMock.mockImplementation((values) => ({
      ...values,
      id: 'id',
    }))

    const data = {
      name: 'foo',
      bio: 'bar',
      dead: true,
    }

    const character = characters(data)

    expect(character.name).toEqual(data.name)
    expect(character.dead).toEqual(data.dead)
    expect(character.immortal).toEqual(false)
    expect(character.bio).toEqual(data.bio)
    expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, 'character')
  })
})
