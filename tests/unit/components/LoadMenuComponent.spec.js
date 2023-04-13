import LoadMenuComponent from "Components/LoadMenuComponent";
import SlideDownPanelComponent from "Components/SlideDownPanelComponent";
import ButtonComponent from "Components/ButtonComponent";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { restoreState, deserialize } from "Libs/gameState";
import localStorage, { supportsLocalStorage } from "Libs/localStorage";

jest.mock("Libs/gameState");

jest.mock("Libs/localStorage");

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LoadMenuComponent", () => {
  let store;
  let actions;
  let mutations;

  beforeEach(() => {
    deserialize.mockImplementation(() => ({
      test: "data",
    }));

    supportsLocalStorage.mockImplementation(() => true);
    localStorage.get.mockImplementation(() => "save-content");

    actions = {
      showNotification: jest.fn(),
    };

    mutations = {
      hide: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        notifications: {
          actions,
          mutations,
          namespaced: true,
        },
      },
    });
  });

  it("Has the correct component name", () => {
    expect(LoadMenuComponent.name).toEqual("LoadMenuComponent");
  });

  it("Renders a SlideDownPanelComponent with a 'Load' heading", () => {
    const wrapper = shallowMount(LoadMenuComponent, {
      stubs: {
        SlideDownPanelComponent,
      },
    });

    expect(wrapper.findComponent(SlideDownPanelComponent).exists()).toBe(true);

    expect(wrapper.text()).toContain("Load");
  });

  it("Renders ButtonComponents with the correct labels", () => {
    const wrapper = shallowMount(LoadMenuComponent, {
      data() {
        return { loading: true };
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
    expect(buttons.at(1).text()).toEqual("From File");
    expect(buttons.at(2).text()).toEqual("From Local Storage");
  });

  it("Does not render the 'From Local Storage' button if local storage is not supported", () => {
    supportsLocalStorage.mockImplementation(() => false);

    const wrapper = shallowMount(LoadMenuComponent, {
      data() {
        return { loading: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper.findAllComponents(ButtonComponent);

    expect(buttons.length).toEqual(2);
    expect(buttons.at(0).text()).toEqual("Close");
    expect(buttons.at(1).text()).toEqual("From File");
  });

  it("Can restore saves from uploaded files", async () => {
    const wrapper = shallowMount(LoadMenuComponent, {
      store,
      localVue,
      data() {
        return { loading: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const mockReadAsText = jest.fn();
    const mockReader = {
      readAsText: mockReadAsText,
      result: "dummy data",
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, "FileReader").mockImplementation(() => mockReader);

    const mockEvent = {
      target: {
        files: [new File(["dummy data"], "dummy.txt", { type: "text/plain" })],
      },
    };

    wrapper.vm.load(mockEvent);

    expect(mockReadAsText).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(true);
    expect(mutations.hide).toHaveBeenCalled();

    mockReader.onload();

    expect(restoreState).toHaveBeenCalledWith(store, { test: "data" });
    expect(wrapper.vm.loading).toBe(false);
  });

  it.each([[[]], [["file1", "file2"]]])(
    "Enforces a mandatory single file to be uploaded before starting a restore from file",
    async (files) => {
      const wrapper = shallowMount(LoadMenuComponent, {
        store,
        localVue,
        data() {
          return { loading: true };
        },
        stubs: {
          SlideDownPanelComponent,
          ButtonComponent,
        },
      });

      const mockReadAsText = jest.fn();
      const mockReader = {
        readAsText: mockReadAsText,
        result: "",
        onload: null,
        onerror: null,
      };

      jest.spyOn(global, "FileReader").mockImplementation(() => mockReader);

      const mockEvent = {
        target: {
          files,
        },
      };

      wrapper.vm.load(mockEvent);

      expect(actions.showNotification).toHaveBeenCalled();
      expect(mockReadAsText).not.toHaveBeenCalled();
      expect(wrapper.vm.loading).toBe(true);
      expect(mutations.hide).not.toHaveBeenCalled();
      expect(restoreState).not.toHaveBeenCalled();
    }
  );

  it("Can handle errors loading an uploaded file", async () => {
    const wrapper = shallowMount(LoadMenuComponent, {
      store,
      localVue,
      data() {
        return { loading: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const mockReadAsText = jest.fn();
    const mockReader = {
      readAsText: mockReadAsText,
      result: "dummy data",
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, "FileReader").mockImplementation(() => mockReader);

    const mockEvent = {
      target: {
        files: [new File(["dummy data"], "dummy.txt", { type: "text/plain" })],
      },
    };

    wrapper.vm.load(mockEvent);

    expect(mockReadAsText).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(true);
    expect(mutations.hide).toHaveBeenCalled();

    mockReader.onerror();

    expect(restoreState).not.toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(true);
    expect(actions.showNotification).toHaveBeenCalled();
  });

  it("Calls 'fromLocalStorage' when the 'From Local Storage' button is clicked", async () => {
    const wrapper = shallowMount(LoadMenuComponent, {
      store,
      localVue,
      data() {
        return { loading: true };
      },
      stubs: {
        SlideDownPanelComponent,
        ButtonComponent,
      },
    });

    const buttons = wrapper
      .findAllComponents(ButtonComponent)
      .filter((w) => w.text() === "From Local Storage");

    expect(buttons.length).toEqual(1);

    const button = buttons.at(0);

    button.vm.$emit("click");
    await wrapper.vm.$nextTick();

    expect(mutations.hide).toHaveBeenCalled();
    expect(localStorage.get).toHaveBeenCalledWith("save-game");
    expect(deserialize).toHaveBeenCalledWith("save-content");
    expect(restoreState).toHaveBeenCalledWith(store, { test: "data" });
    expect(wrapper.vm.loading).toBe(false);
  });
});
