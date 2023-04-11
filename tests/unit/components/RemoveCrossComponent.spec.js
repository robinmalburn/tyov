import RemoveCrossComponent from "Components/RemoveCrossComponent";
import { shallowMount } from "@vue/test-utils";

describe("components/RemoveCrossComponent.vue", () => {
  it("Has the correct component name", () => {
    expect(RemoveCrossComponent.name).toEqual("RemoveCrossComponent");
  });

  it("Renders the correct content", () => {
    const wrapper = shallowMount(RemoveCrossComponent);

    const classes = [
      "cursor-pointer",
      "select-none",
      "mx-1",
      "hover:text-gray-400",
    ];

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes("title")).toBe("Remove item");
    expect(wrapper.text()).toBe(`\u00d7`);
    expect(wrapper.classes()).toEqual(classes);
  });

  it("Emits a 'remove' event when clicked.", async () => {
    const wrapper = shallowMount(RemoveCrossComponent);
    const span = wrapper.find('span');

    expect(span.exists()).toBe(true);

    span.trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().remove).toBeTruthy();
  })
});
