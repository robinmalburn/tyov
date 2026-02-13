import { describe, it, expect, vi, afterEach } from 'vitest'
import { baseEntityFactory } from 'Libs/entities'
import {
  resourceEntityFactory,
  diaryEntityFactory,
} from 'Libs/entities/resources'

vi.mock('Libs/entities')

const baseEntityFactoryMock = vi.mocked(baseEntityFactory)

describe('lib/entities/resources.js', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Test suite for resource entities.', () => {
    it('Can create a default resource entity.', () => {
      const resource = resourceEntityFactory()

      expect(resource.name).toEqual('')
      expect(resource.lost).toEqual(false)
      expect(resource.stationary).toEqual(false)
      expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, 'resource')
    })

    it('Can create a resource entity with injected data.', () => {
      baseEntityFactoryMock.mockImplementation((values) => ({
        ...values,
        id: 'id',
      }))

      const data = {
        name: 'foo',
        lost: true,
        stationary: true,
      }

      const resource = resourceEntityFactory(data)

      expect(resource.name).toEqual(data.name)
      expect(resource.lost).toEqual(data.lost)
      expect(resource.stationary).toEqual(data.stationary)
      expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, 'resource')
    })
  })

  describe('Test suite for diary entities.', () => {
    it('Can create a default diary entity.', () => {
      const diary = diaryEntityFactory()

      expect(diary.name).toEqual('')
      expect(diary.lost).toEqual(false)
      expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, 'diary')
    })

    it('Can create a diary entity with injected data.', () => {
      baseEntityFactoryMock.mockImplementation((values) => ({
        ...values,
        id: 'id',
      }))

      const data = {
        name: 'foo',
        lost: true,
      }

      const diary = diaryEntityFactory(data)

      expect(diary.name).toEqual(data.name)
      expect(diary.lost).toEqual(data.lost)
      expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, 'diary')
    })
  })
})
