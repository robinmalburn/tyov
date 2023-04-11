import FormToggleComponent from "Components/FormToggleComponent";
import { shallowMount, mount } from "@vue/test-utils";

describe("components/FormToggleComponent.vue", () => {
  it("Has the correct component name", () => {
    expect(FormToggleComponent.name).toEqual("FormToggleComponent");
  });

  it("Renders a full width button when showControls is false", () => {
    const wrapper = shallowMount(FormToggleComponent, {
      propsData: {
        showControls: false,
      },
      slots: {
        button: "Click me",
      },
    });

    const button = wrapper.findComponent({ name: "ButtonComponent" });

    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Click me");
    expect(button.classes()).toContain("w-full");
  });

  it.each(["default", "primary", "secondary"])(
    "Renders a full width button with type %s",
    (type) => {
      const wrapper = shallowMount(FormToggleComponent, {
        propsData: {
          showControls: false,
          type,
        },
      });

      expect(wrapper.find(".w-full").attributes().type).toBe(type);
    }
  );

  it("Emits a toggle event when the full width button is clicked", async () => {
    const config = {
      propsData: {
        showControls: false,
      },
      slots: {
        button: "Click me",
      },
    };

    const wrapper = shallowMount(FormToggleComponent, config);

    const button = wrapper.findComponent({ name: "ButtonComponent" });
    button.vm.$emit("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().toggle).toBeTruthy();
    expect(wrapper.emitted().toggle[0][0]).toEqual(
      config.propsData.showControls
    );
  });

  it("Renders the form when showControls is true", () => {
    const wrapper = shallowMount(FormToggleComponent, {
      propsData: {
        showControls: true,
      },
      slots: {
        form: '<div class="form-content">Form content</div>',
      },
    });

    expect(wrapper.findComponent({ name: "FormComponent" }).exists()).toBe(
      true
    );
    expect(wrapper.find(".form-content").text()).toBe("Form content");
  });

  it("Emits a toggle event when the cancel button in the form is clicked", async () => {
    const config = {
      propsData: {
        showControls: true,
      },
      slots: {
        form: '<div class="form-content"></div>',
      },
    };

    const wrapper = mount(FormToggleComponent, config);

    const buttons = wrapper
      .findAllComponents({ name: "ButtonComponent" })
      .filter((w) => w.text() === "Cancel");

    expect(buttons.exists()).toBe(true);

    const button = buttons.at(0);

    button.vm.$emit("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().toggle).toBeTruthy();
    expect(wrapper.emitted().toggle[0][0]).toEqual(
      config.propsData.showControls
    );
  });

  it("Emits a save event when the save button in the form is clicked", async () => {
    const config = {
      propsData: {
        showControls: true,
      },
      slots: {
        form: '<div class="form-content"></div>',
      },
    };

    const wrapper = mount(FormToggleComponent, config);

    const buttons = wrapper
      .findAllComponents({ name: "ButtonComponent" })
      .filter((w) => w.text() === "Save");

    expect(buttons.exists()).toBe(true);

    const button = buttons.at(0);

    button.vm.$emit("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().save).toBeTruthy();
  });

  it.each([true, false])(
    "Renders controls based on showControls prop",
    (showControls) => {
      const wrapper = shallowMount(FormToggleComponent, {
        propsData: {
          showControls,
        },
        slots: {
          button: "Click me",
          form: '<div class="form-content">Form content</div>',
        },
      });

      if (showControls) {
        const form = wrapper.findComponent({ name: "FormComponent" });
        expect(form.exists()).toBe(true);
        expect(form.text()).toEqual("Form content");
      } else {
        const button = wrapper.findComponent({ name: "ButtonComponent" });
        expect(button.exists()).toBe(true);
        expect(button.text()).toEqual("Click me");
      }
    }
  );
});
