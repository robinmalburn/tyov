import { describe, it, expect } from "vitest";
import HeadingComponent from "Components/HeadingComponent";
import { shallowMount } from "@vue/test-utils";

const HEADING_STYLES = {
  base: [
    "font-semibold",
    "leading-loose",
    "tracking-widest",
    "text-indigo-800",
  ],
  1: ["text-3xl"],
  2: ["text-2xl"],
  3: ["text-xl"],
  4: ["text-base"],
  5: ["text-sm"],
  6: ["text-sm"],
};

describe("components/HeadingComponent.vue", () => {
  it("Renders without any props", () => {
    const wrapper = shallowMount(HeadingComponent, {
      slots: {
        default: "Hello World",
      },
    });

    const classes = [...HEADING_STYLES.base, ...HEADING_STYLES[1]];
    const heading = wrapper.find("h1");

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toEqual(classes);

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toEqual(classes);
    expect(heading.text()).toBe("Hello World");
  });

  it("Can set the default slot", () => {
    const wrapper = shallowMount(HeadingComponent, {
      props: {
        level: "1",
      },
      slots: {
        default: "Hello World",
      },
    });

    const heading = wrapper.find("h1");

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toEqual("Hello World");
  });

  it.each([1, 2, 3, 4, 5, 6])(
    "Adds the correct default classes to the heading tag",
    (lvl) => {
      const wrapper = shallowMount(HeadingComponent, {
        props: {
          level: `${lvl}`,
        },
        slots: {
          default: "Hello World",
        },
      });

      const classes = [...HEADING_STYLES.base, ...HEADING_STYLES[lvl]];
      const heading = wrapper.find(`h${lvl}`);

      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toEqual(classes);
    }
  );

  it("Can add extra classes to the heading tag", () => {
    const wrapper = shallowMount(HeadingComponent, {
      props: {
        level: "1",
      },
      slots: {
        default: "Hello World",
      },
      attrs: {
        class: "text-red-500",
      },
    });

    const heading = wrapper.find("h1");

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toContain("text-red-500");
  });

  it.each([
    { given: 0, replacement: 1 },
    { given: -1, replacement: 1 },
    { given: 7, replacement: 6 },
    { given: 8, replacement: 6 },
  ])(
    "Only allows level prop values from 1 to 6 - convert $given to $replacement",
    ({ given, replacement }) => {
      const wrapper = shallowMount(HeadingComponent, {
        props: {
          level: `${given}`,
        },
        slots: {
          default: "Hello World",
        },
      });

      expect(wrapper.find(`h${replacement}`).exists()).toBe(true);
      expect(wrapper.find(`h${given}`).exists()).toBe(false);
    }
  );

  it("Adds both static and dynamic classes to the heading tag", () => {
    const wrapper = shallowMount(HeadingComponent, {
      props: {
        level: "1",
      },
      attrs: {
        class: "text-red-500 text-green-500 text-grey-500",
      },
    });

    const heading = wrapper.find("h1");

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toContain("text-red-500");
    expect(heading.classes()).toContain("text-green-500");
    expect(heading.classes()).toContain("text-grey-500");
  });
});
