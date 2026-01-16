import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SaveMenuComponent from "Components/SaveMenuComponent";
import SlideDownPanelComponent from "Components/SlideDownPanelComponent";
import ButtonComponent from "Components/ButtonComponent";
import { shallowMount, mount } from "@vue/test-utils";
import { getStateFromStore, serialize } from "Libs/gameState";
import localStorage, { supportsLocalStorage } from "Libs/localStorage";

vi.mock("Libs/gameState");

vi.mock("Libs/localStorage");

describe("SaveMenuComponent", () => {
  beforeEach(() => {
    getStateFromStore.mockImplementation(() => ({ test: "data" }));
    serialize.mockImplementation(() => "serialized");
    supportsLocalStorage.mockImplementation(() => true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Renders a SlideDownPanelComponent with a 'Save' heading", () => {
    const wrapper = mount(SaveMenuComponent);

    expect(wrapper.findComponent(SlideDownPanelComponent).exists()).toBe(true);

    expect(wrapper.text()).toContain("Save");
  });

  it("Renders ButtonComponents with the correct labels", async () => {
    const wrapper = mount(SaveMenuComponent);

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0);
    await toggleButton.trigger("click");

    const buttons = wrapper.findAllComponents(ButtonComponent);

    // SlideDownPanel has 1 button (Show/Close), plus 2 buttons for To File and To Local Storage
    expect(buttons.length).toEqual(3);
    // Skip the first button which is from SlideDownPanel
    expect(buttons.at(1).text()).toEqual("To File");
    expect(buttons.at(2).text()).toEqual("To Local Storage");
  });

  it("Does not render the 'To Local Storage' button if local storage is not supported", async () => {
    supportsLocalStorage.mockImplementation(() => false);

    const wrapper = mount(SaveMenuComponent);

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0);
    await toggleButton.trigger("click");

    const buttons = wrapper.findAllComponents(ButtonComponent);

    // SlideDownPanel has 1 button (Show/Close), plus 1 button for To File only
    expect(buttons.length).toEqual(2);
    expect(buttons.at(1).text()).toEqual("To File");
  });

  it("Calls 'toFile' when the 'To File' button is clicked", async () => {
    const wrapper = mount(SaveMenuComponent);

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0);
    await toggleButton.trigger("click");

    const buttons = wrapper
      .findAllComponents(ButtonComponent)
      .filter((w) => w.text() === "To File");

    expect(buttons.length).toEqual(1);

    global.URL.createObjectURL = vi.fn();

    const button = buttons.at(0);

    button.vm.$emit("click");
    await wrapper.vm.$nextTick();

    expect(getStateFromStore).toHaveBeenCalled();
    expect(serialize).toHaveBeenCalledWith({ test: "data" });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("Calls 'toLocalStorage' when the 'To Local Storage' button is clicked", async () => {
    const wrapper = mount(SaveMenuComponent);

    // Click toggle button to open the panel
    const toggleButton = wrapper.findAllComponents(ButtonComponent).at(0);
    await toggleButton.trigger("click");

    const buttons = wrapper
      .findAllComponents(ButtonComponent)
      .filter((w) => w.text() === "To Local Storage");

    expect(buttons.length).toEqual(1);

    const button = buttons.at(0);

    button.vm.$emit("click");
    await wrapper.vm.$nextTick();

    expect(getStateFromStore).toHaveBeenCalled();
    expect(serialize).toHaveBeenCalledWith({ test: "data" });
    expect(localStorage.set).toHaveBeenCalledWith("save-game", "serialized");
  });
});
