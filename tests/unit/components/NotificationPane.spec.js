import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NotificationPane from 'Components/NotificationPane'
import { shallowMount, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useNotificationsStore } from 'Stores/notifications'

vi.useFakeTimers()

const TYPES = {
  default: ['border-indigo-400', 'bg-indigo-100', 'text-indigo-600'],
  danger: ['border-red-600', 'bg-red-200', 'text-red-800'],
  warning: ['border-yellow-400', 'bg-yellow-100', 'text-yellow-600'],
}

describe('NotificationPane', () => {
  let notificationsStore

  afterEach(() => {
    vi.clearAllTimers()
    vi.resetAllMocks()
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    notificationsStore = useNotificationsStore()
    notificationsStore.message = ''
    notificationsStore.visible = false
    notificationsStore.type = 'default'
  })

  it('Displays the correct message', () => {
    const message = 'Test message'
    notificationsStore.message = message
    const wrapper = shallowMount(NotificationPane)
    expect(wrapper.text()).toContain(message)
  })

  it.each(Object.keys(TYPES))(
    'Displays the correct type of notification - %s',
    (type) => {
      notificationsStore.type = type
      const wrapper = shallowMount(NotificationPane)
      const classes = TYPES[type]
      expect(wrapper.find('div').classes()).toEqual(
        expect.arrayContaining(classes),
      )
    },
  )

  it('Hides after a certain amount of time', async () => {
    // Start with visible = false
    notificationsStore.visible = false

    const wrapper = mount(NotificationPane)

    // Wait for next tick to ensure watcher is registered
    await wrapper.vm.$nextTick()

    // NOW set visible to true, which should trigger the watcher
    notificationsStore.visible = true

    // Wait for watcher to react
    await wrapper.vm.$nextTick()

    // Verify it starts visible
    expect(notificationsStore.visible).toBe(true)

    // Advance timers by more than the timeout (5000ms)
    await vi.advanceTimersByTimeAsync(5100)

    // Check if hide was called by checking the visible state
    // The hide action sets visible to false
    expect(notificationsStore.visible).toBe(false)
  })

  it("Emits a 'remove' event when the remove cross component is clicked", async () => {
    const hideSpy = vi.spyOn(notificationsStore, 'hide')
    const wrapper = mount(NotificationPane)
    const removeCross = wrapper.findComponent({ name: 'RemoveCrossComponent' })
    await removeCross.trigger('click')
    await wrapper.vm.$nextTick()
    expect(hideSpy).toHaveBeenCalled()
  })
})
