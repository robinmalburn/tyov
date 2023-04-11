import SaveMenuComponent from "Components/SaveMenuComponent";
import SlideDownPanelComponent from "Components/SlideDownPanelComponent";
import ButtonComponent from "Components/ButtonComponent";
import { shallowMount } from "@vue/test-utils";
import { getStateFromStore, serialize } from "Libs/gameState";
import localStorage, { supportsLocalStorage } from "Libs/localStorage";

jest.mock("Libs/gameState");

jest.mock("Libs/localStorage");

describe("SaveMenuComponent", () => {
  beforeEach(() => {
    getStateFromStore.mockImplementation(() => ({ test: "data" }));
    serialize.mockImplementation(() => 'serialized');
    supportsLocalStorage.mockImplementation(() => true);
  });

  it("Has the correct component name", () => {
    expect(SaveMenuComponent.name).toEqual("SaveMenuComponent");
  });

  it("Renders a SlideDownPanelComponent with a 'Save' heading", () => {
    const wrapper = shallowMount(SaveMenuComponent, {
      stubs: {
        SlideDownPanelComponent,
      },
    });

    expect(wrapper.findComponent(SlideDownPanelComponent).exists()).toBe(true);

    expect(wrapper.text()).toContain("Save");
  });

  it("Renders ButtonComponents with the correct labels", () => {
    const wrapper = shallowMount(SaveMenuComponent, {
      data() {
        return { saving: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper.findAllComponents(ButtonComponent);

    expect(supportsLocalStorage).toHaveBeenCalled();
    expect(buttons.length).toEqual(3);
    expect(buttons.at(0).text()).toEqual("Close");
    expect(buttons.at(1).text()).toEqual("To File");
    expect(buttons.at(2).text()).toEqual("To Local Storage");
  });

  it("Does not render the 'To Local Storage' button if local storage is not supported", () => {
    supportsLocalStorage.mockImplementation(() => false);

    const wrapper = shallowMount(SaveMenuComponent, {
      data() {
        return { saving: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper.findAllComponents(ButtonComponent);

    expect(buttons.length).toEqual(2);
    expect(buttons.at(0).text()).toEqual("Close");
    expect(buttons.at(1).text()).toEqual("To File");
  });

  it("Calls 'toFile' when the 'To File' button is clicked", async () => {
    const wrapper = shallowMount(SaveMenuComponent, {
      data() {
        return { saving: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper.findAllComponents(ButtonComponent).filter(w => w.text() === 'To File');

    expect(buttons.length).toEqual(1);

    global.URL.createObjectURL = jest.fn();

    const button = buttons.at(0);

    button.vm.$emit("click");
    await wrapper.vm.$nextTick();

    expect(getStateFromStore).toHaveBeenCalled();
    expect(serialize).toHaveBeenCalledWith({ test: "data" });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(wrapper.vm.saving).toBe(false);
  });

  it("Calls 'toLocalStorage' when the 'To Local Storage' button is clicked", async () => {
    const wrapper = shallowMount(SaveMenuComponent, {
      data() {
        return { saving: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper.findAllComponents(ButtonComponent).filter(w => w.text() === 'To Local Storage');

    expect(buttons.length).toEqual(1);

    const button = buttons.at(0);

    button.vm.$emit("click");
    await wrapper.vm.$nextTick();

    expect(getStateFromStore).toHaveBeenCalled();
    expect(serialize).toHaveBeenCalledWith({ test: "data" });
    expect(localStorage.set).toHaveBeenCalledWith("save-game", "serialized");
    expect(wrapper.vm.saving).toBe(false);
  });
});
