import { describe, it, expect } from "vitest";
import FormComponent from "Components/FormComponent";
import { shallowMount, mount } from "@vue/test-utils";

const CONTAINER_CLASSES = ["my-1", "flex", "flex-col", "md:flex-row"];

describe("components/FormComponent.vue", () => {
  it("Supports setting the default slot within the form.", () => {
    const slot = '<div id="test">foo</div>';
    const wrapper = shallowMount(FormComponent, {
      slots: {
        default: slot,
      },
    });

    expect(wrapper.find("#test").html()).toEqual(slot);
  });

  it("Has the correct styles on the button container.", () => {
    const wrapper = shallowMount(FormComponent);
    const container = wrapper.findAll("div").at(1);

    expect(container.exists()).toBe(true);
    expect(container.classes()).toEqual(CONTAINER_CLASSES);
  });

  it("Uses a set of default buttons.", () => {
    const props = [
      {
        type: "default",
        event: "save",
        label: "Save",
      },
      {
        type: "default",
        event: "cancel",
        label: "Cancel",
      },
    ];

    const wrapper = mount(FormComponent);

    expect(wrapper.props("buttons")).toEqual(props);

    const buttons = wrapper.findAllComponents({ name: "ButtonComponent" });

    expect(buttons).toHaveLength(2);

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons.at(i);
      expect(btn.exists()).toBe(true);
      expect(btn.props("type")).toBe(props[i].type);
      expect(btn.text()).toBe(props[i].label);
    }
  });

  it("Emits the expected default synthetic events when receiving a synthetic click.", async () => {
    const props = [
      {
        type: "default",
        event: "save",
        label: "Save",
      },
      {
        type: "default",
        event: "cancel",
        label: "Cancel",
      },
    ];

    const wrapper = shallowMount(FormComponent);

    expect(wrapper.props("buttons")).toEqual(props);

    const buttons = wrapper.findAllComponents({ name: "ButtonComponent" });

    expect(buttons).toHaveLength(2);

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons.at(i);
      btn.vm.$emit("click");
      await btn.vm.$nextTick();
      expect(wrapper.emitted()[props[i].event]).toBeTruthy();
    }
  });

  describe("Supports a variable number of buttons with custom labels, types, and events", () => {
    const buttonPropsProvider = [
      {
        description: "with three buttons",
        props: [
          {
            type: "primary",
            event: "save",
            label: "Save",
          },
          {
            type: "secondary",
            event: "delete",
            label: "Delete",
          },
          {
            type: "default",
            event: "cancel",
            label: "Cancel",
          },
        ],
      },
      {
        description: "with one button",
        props: [
          {
            type: "default",
            event: "cancel",
            label: "Cancel",
          },
        ],
      },
    ];

    buttonPropsProvider.forEach(({ description, props }) => {
      it(`It correctly displays ${description}`, async () => {
        const wrapper = mount(FormComponent, {
          props: {
            buttons: props,
          },
        });

        const buttons = wrapper.findAllComponents({ name: "ButtonComponent" });

        expect(buttons).toHaveLength(props.length);

        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons.at(i);
          expect(btn.exists()).toBe(true);
          expect(btn.props("type")).toBe(props[i].type);
          expect(btn.text()).toBe(props[i].label);
          btn.vm.$emit("click");
          await btn.vm.$nextTick();
          expect(wrapper.emitted()[props[i].event]).toBeTruthy();
        }
      });
    });
  });
});
