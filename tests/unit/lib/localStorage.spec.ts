import { describe, it, expect, vi, afterEach } from 'vitest'
import localStorage, { supportsLocalStorage } from 'Libs/localStorage'

describe('lib/localStorage.js', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it.each(['foo', true, 123, { foo: 123 }])(
    'Can set a value in storage.',
    (input) => {
      const stringify = vi.spyOn(JSON, 'stringify')
      const setItem = vi.spyOn(global.localStorage.__proto__, 'setItem')

      localStorage.set('foo', input)

      if (typeof input !== 'string') {
        expect(stringify).toBeCalledWith(input)
      }

      expect(setItem).toBeCalled()
    },
  )

  it.each([
    ['foo', null],
    ['bar', 'bar'],
  ])('Can retrieve a value from storage.', (key, value) => {
    const parse = vi.spyOn(JSON, 'parse')
    parse.mockImplementation((val) => val)

    const getItem = vi.spyOn(global.localStorage.__proto__, 'getItem')
    getItem.mockReturnValue(value)

    const result = localStorage.get(key)

    if (value !== null) {
      expect(parse).toBeCalledWith(value)
    }

    expect(getItem).toBeCalledWith(key)
    expect(result).toEqual(value)
  })

  it('Can get a value from storage, even if it cannot be parsed.', () => {
    const value = 'bar'
    const key = 'foo'

    const parse = vi.spyOn(JSON, 'parse')

    const getItem = vi.spyOn(global.localStorage.__proto__, 'getItem')
    getItem.mockReturnValue(value)

    parse.mockImplementation(() => {
      throw 'Failure to parse'
    })
    const result = localStorage.get(key)

    expect(parse).toBeCalledWith(value)
    expect(getItem).toBeCalledWith(key)
    expect(result).toEqual(value)
  })

  describe.each([localStorage.supported, supportsLocalStorage])(
    'Checks local storage support.',
    (supportCheckFn) => {
      it('Can have support checked and confirmed.', () => {
        const setItem = vi.spyOn(global.localStorage.__proto__, 'setItem')
        const removeItem = vi.spyOn(global.localStorage.__proto__, 'removeItem')

        const isSupported = supportCheckFn()

        expect(isSupported).toEqual(true)
        expect(setItem).toHaveBeenCalled()
        expect(removeItem).toHaveBeenCalled()
      })

      it('Can have support checked and denied.', () => {
        const setItem = vi.spyOn(global.localStorage.__proto__, 'setItem')
        const removeItem = vi.spyOn(global.localStorage.__proto__, 'removeItem')

        removeItem.mockImplementation(() => {
          throw 'should not be supported.'
        })

        const isSupported = supportCheckFn()

        expect(isSupported).toEqual(false)
        expect(setItem).toHaveBeenCalled()
        expect(removeItem).toHaveBeenCalled()
      })
    },
  )
})
