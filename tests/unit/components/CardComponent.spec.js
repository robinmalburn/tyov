import { describe, it, expect } from 'vitest'
import CardComponent from 'Components/CardComponent.vue'
import { shallowMount } from '@vue/test-utils'

const CLASSES = [
  'm-4',
  'p-4',
  'border',
  'rounded',
  'border-gray-100',
  'shadow-md',
  'hover:shadow-xl',
  'transition-all',
]

describe('components/CardComponent.vue', () => {
  it('Creates an element with the correct classes.', () => {
    const wrapper = shallowMount(CardComponent)

    expect(wrapper.classes()).toEqual(CLASSES)
  })

  it('Supports setting the default slot within the card.', () => {
    const slot = '<div id="test">foo</div>'
    const wrapper = shallowMount(CardComponent, {
      slots: {
        default: slot,
      },
    })

    expect(wrapper.classes()).toEqual(CLASSES)
    expect(wrapper.find('#test').html()).toEqual(slot)
  })
})
