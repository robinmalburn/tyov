import { describe, it, expect } from 'vitest'
import ButtonComponent from 'Components/ButtonComponent.vue'
import { shallowMount } from '@vue/test-utils'

const CLASSES = [
  'py-1',
  'px-4',
  'rounded',
  'transition-colors',
  'focus:outline-none',
  'focus:ring-2',
  'ring-0',
]

const BUTTON_TYPES = {
  default: ['bg-gray-200', 'hover:bg-gray-400', 'ring-gray-100'],
  primary: ['bg-red-700', 'hover:bg-red-900', 'text-white', 'ring-red-600'],
  secondary: [
    'bg-indigo-400',
    'hover:bg-indigo-600',
    'text-white',
    'ring-indigo-300',
  ],
}

describe('components/ButtonComponent.vue', () => {
  it('Uses a default button style if no style is given.', () => {
    const classes = [...CLASSES, ...BUTTON_TYPES.default]

    const wrapper = shallowMount(ButtonComponent)

    expect(wrapper.classes()).toEqual(classes)
  })

  it.each([
    ['default', BUTTON_TYPES.default],
    ['primary', BUTTON_TYPES.primary],
    ['secondary', BUTTON_TYPES.secondary],
  ])(
    'Can specify different button types that inherit the correct styles',
    (type, typeClasses) => {
      const classes = [...CLASSES, ...typeClasses]

      const wrapper = shallowMount(ButtonComponent, {
        props: {
          type,
        },
      })

      expect(wrapper.classes()).toEqual(classes)
    },
  )

  it('Supports setting the default slot within the button.', () => {
    const slot = '<div id="test">foo</div>'
    const wrapper = shallowMount(ButtonComponent, {
      slots: {
        default: slot,
      },
    })

    expect(wrapper.find('#test').html()).toEqual(slot)
  })

  it('Emits a synthetic click event when receiving a real click.', async () => {
    const wrapper = shallowMount(ButtonComponent)
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
