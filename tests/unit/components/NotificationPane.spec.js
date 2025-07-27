import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NotificationPane from "Components/NotificationPane";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const TYPES = {
  default: ["border-indigo-400", "bg-indigo-100", "text-indigo-600"],
  danger: ["border-red-600", "bg-red-200", "text-red-800"],
  warning: ["border-yellow-400", "bg-yellow-100", "text-yellow-600"],
};

describe("NotificationPane", () => {
  let store;
  let state;
  let mutations;

  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    state = {
      message: "",
      visible: false,
      type: "default",
    };

    mutations = {
      hide: vi.fn(),
    };

    store = new Vuex.Store({
      modules: {
        notifications: {
          state,
          mutations,
          namespaced: true,
        },
      },
    });
  });

  it("Has the correct component name", () => {
    expect(NotificationPane.name).toEqual("NotificationPane");
  });

  it("Displays the correct message", () => {
    const message = "Test message";
    state.message = message;
    const wrapper = shallowMount(NotificationPane, { store, localVue });
    expect(wrapper.text()).toContain(message);
  });

  it.each(Object.keys(TYPES))(
    "Displays the correct type of notification - %s",
    (type) => {
      state.type = type;
      const wrapper = shallowMount(NotificationPane, { store, localVue });
      const classes = TYPES[type];
      expect(wrapper.find("div").classes()).toEqual(
        expect.arrayContaining(classes)
      );
    }
  );

  it("Hides after a certain amount of time", async () => {
    const wrapper = shallowMount(NotificationPane, {
      store,
      localVue,
      data() {
        return {
          timeout: 100,
        };
      },
    });
    state.visible = true;
    await wrapper.vm.$nextTick();
    const hideSpy = vi.spyOn(wrapper.vm, "hide");
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(hideSpy).toHaveBeenCalled();
  });

  it("Emits a 'remove' event when the remove cross component is clicked", () => {
    const wrapper = shallowMount(NotificationPane, { store, localVue });
    const removeCross = wrapper.findComponent({ name: "RemoveCrossComponent" });
    removeCross.vm.$emit("remove");
    expect(mutations.hide).toHaveBeenCalled();
  });
});
