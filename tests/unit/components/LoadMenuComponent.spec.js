import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Mock modules BEFORE importing components that use them
vi.mock('Libs/gameState')

vi.mock('Libs/localStorage', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
  supportsLocalStorage: vi.fn(() => true),
}))

// Now import components and dependencies
import LoadMenuComponent from 'Components/LoadMenuComponent'
import SlideDownPanelComponent from 'Components/SlideDownPanelComponent'
import ButtonComponent from 'Components/ButtonComponent'
import { useNotificationsStore } from 'Stores/notifications'
import { restoreState, deserialize } from 'Libs/gameState'
import localStorage, { supportsLocalStorage } from 'Libs/localStorage'

describe('LoadMenuComponent', () => {
  let notificationsStore

  beforeEach(() => {
    setActivePinia(createPinia())
    notificationsStore = useNotificationsStore()

    deserialize.mockImplementation(() => ({
      test: 'data',
    }))

    supportsLocalStorage.mockImplementation(() => true)
    localStorage.get.mockImplementation(() => 'save-content')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("Renders a SlideDownPanelComponent with a 'Load' heading", () => {
    const wrapper = mount(LoadMenuComponent)

    expect(wrapper.findComponent(SlideDownPanelComponent).exists()).toBe(true)

    expect(wrapper.text()).toContain('Load')
  })

  it('Renders ButtonComponents with the correct labels', async () => {
    const wrapper = mount(LoadMenuComponent)

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0)
    await toggleButton.trigger('click')

    const buttons = wrapper.findAllComponents(ButtonComponent)

    // SlideDownPanel has 1 button (Show/Close), plus 2 buttons for From File and From Local Storage
    expect(buttons.length).toEqual(3)
    // Skip the first button which is from SlideDownPanel
    expect(buttons.at(1).text()).toEqual('From File')
    expect(buttons.at(2).text()).toEqual('From Local Storage')
  })

  it("Does not render the 'From Local Storage' button if local storage is not supported", async () => {
    supportsLocalStorage.mockReturnValue(false)

    const wrapper = mount(LoadMenuComponent)
    await wrapper.vm.$nextTick()

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0)
    await toggleButton.trigger('click')
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAllComponents(ButtonComponent)

    // SlideDownPanel has 1 button (Show/Close), plus only 1 button for From File
    // (From Local Storage button should not be rendered)
    expect(buttons.length).toEqual(2)
    expect(buttons.at(1).text()).toEqual('From File')
  })

  it('Can restore saves from uploaded files', async () => {
    const hideSpy = vi.spyOn(notificationsStore, 'hide')
    const wrapper = shallowMount(LoadMenuComponent, {
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    })

    const mockReadAsText = vi.fn()
    const mockReader = {
      readAsText: mockReadAsText,
      result: 'dummy data',
      onload: null,
      onerror: null,
    }

    vi.spyOn(global, 'FileReader').mockImplementation(function () {
      return mockReader
    })

    const mockEvent = {
      target: {
        files: [new File(['dummy data'], 'dummy.txt', { type: 'text/plain' })],
      },
    }

    wrapper.vm.load(mockEvent)

    expect(mockReadAsText).toHaveBeenCalled()
    expect(hideSpy).toHaveBeenCalled()

    mockReader.onload()

    expect(restoreState).toHaveBeenCalledWith({ test: 'data' })
  })

  it.each([[[]], [['file1', 'file2']]])(
    'Enforces a mandatory single file to be uploaded before starting a restore from file',
    async (files) => {
      const wrapper = shallowMount(LoadMenuComponent, {
        stubs: {
          SlideDownPanelComponent,
          ButtonComponent,
        },
      })

      const showNotificationSpy = vi.spyOn(
        notificationsStore,
        'showNotification',
      )

      const mockReadAsText = vi.fn()
      const mockReader = {
        readAsText: mockReadAsText,
        result: '',
        onload: null,
        onerror: null,
      }

      vi.spyOn(global, 'FileReader').mockImplementation(function () {
        return mockReader
      })

      const mockEvent = {
        target: {
          files,
        },
      }

      wrapper.vm.load(mockEvent)

      expect(showNotificationSpy).toHaveBeenCalled()
      expect(mockReadAsText).not.toHaveBeenCalled()
      expect(restoreState).not.toHaveBeenCalled()
    },
  )

  it('Can handle errors loading an uploaded file', async () => {
    const showNotificationSpy = vi.spyOn(notificationsStore, 'showNotification')
    const hideSpy = vi.spyOn(notificationsStore, 'hide')
    const wrapper = shallowMount(LoadMenuComponent, {
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    })

    const mockReadAsText = vi.fn()
    const mockReader = {
      readAsText: mockReadAsText,
      result: 'dummy data',
      onload: null,
      onerror: null,
    }

    vi.spyOn(global, 'FileReader').mockImplementation(function () {
      return mockReader
    })

    const mockEvent = {
      target: {
        files: [new File(['dummy data'], 'dummy.txt', { type: 'text/plain' })],
      },
    }

    wrapper.vm.load(mockEvent)

    expect(mockReadAsText).toHaveBeenCalled()
    expect(hideSpy).toHaveBeenCalled()

    mockReader.onerror()

    expect(restoreState).not.toHaveBeenCalled()
    expect(showNotificationSpy).toHaveBeenCalled()
  })

  it("Calls 'fromLocalStorage' when the 'From Local Storage' button is clicked", async () => {
    const hideSpy = vi.spyOn(notificationsStore, 'hide')
    const wrapper = mount(LoadMenuComponent)

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0)
    await toggleButton.trigger('click')
    await wrapper.vm.$nextTick()

    const buttons = wrapper
      .findAllComponents(ButtonComponent)
      .filter((w) => w.text() === 'From Local Storage')

    expect(buttons.length).toEqual(1)

    const button = buttons.at(0)

    button.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(hideSpy).toHaveBeenCalled()
    expect(localStorage.get).toHaveBeenCalledWith('save-game')
    expect(deserialize).toHaveBeenCalledWith('save-content')
    expect(restoreState).toHaveBeenCalledWith({ test: 'data' })
  })
})
