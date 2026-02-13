import { describe, it, expect } from 'vitest'
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent'
import { mount, shallowMount } from '@vue/test-utils'

describe('components/SlideDownPanelComponent.vue', () => {
  it('Renders the panel closed by default', () => {
    const wrapper = mount(SlideDownPanelComponent)
    const button = wrapper.findComponent({ name: 'ButtonComponent' })
    expect(wrapper.vm.isOpen).toBe(false)
    expect(button.text()).toBe('Show')
  })

  it('Toggles the panel when the button is clicked and emits a change event', async () => {
    const wrapper = mount(SlideDownPanelComponent)
    const button = wrapper.findComponent({ name: 'ButtonComponent' })

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().change).toBeTruthy()
    expect(button.text()).toEqual('Close')
    expect(wrapper.emitted().change[0][0]).toEqual(true)
    expect(wrapper.vm.isOpen).toBe(true)

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().change).toBeTruthy()
    expect(button.text()).toEqual('Show')
    expect(wrapper.emitted().change[1][0]).toEqual(false)
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('Displays the correct heading slot when the panel is open or closed', async () => {
    const wrapper = mount(SlideDownPanelComponent, {
      slots: {
        'closed-heading': 'Foo',
        'open-heading': 'Bar',
        default: '<p>Panel content</p>',
      },
    })

    expect(wrapper.text()).toContain('Foo')

    const button = wrapper.findComponent({ name: 'ButtonComponent' })

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Bar')
  })

  it('Applies the correct classes to the panel when it is open or closed', async () => {
    const classes = {
      closed: ['my-2', 'transition-all'],
      open: [
        'my-2',
        'transition-all',
        'p-4',
        'border',
        'rounded',
        'border-indigo-200',
        'shadow-md',
        'hover:shadow-xl',
      ],
    }

    const wrapper = shallowMount(SlideDownPanelComponent)

    expect(wrapper.classes()).toEqual(classes.closed)

    const button = wrapper.findComponent({ name: 'ButtonComponent' })

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toEqual(classes.open)
  })

  it('Renders the default slot and toggles its visibility', async () => {
    const content = 'Panel Content'
    const wrapper = shallowMount(SlideDownPanelComponent, {
      slots: {
        default: `<p>${content}</p>`,
      },
    })

    expect(wrapper.text()).not.toContain(content)

    const button = wrapper.findComponent({ name: 'ButtonComponent' })

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(content)

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain(content)
  })
})
