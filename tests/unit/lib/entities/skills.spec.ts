import { describe, it, expect, vi, afterEach } from "vitest";
import { baseEntityFactory } from "Libs/entities";
import skills from "Libs/entities/skills";

vi.mock("Libs/entities");

const baseEntityFactoryMock = vi.mocked(baseEntityFactory);

describe("lib/entities/skills.js", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Can create a default skill entity.", () => {
    const skill = skills();

    expect(skill.name).toEqual("");
    expect(skill.checked).toEqual(false);
    expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, "skill");
  });

  it("Can create a skill entity with injected data.", () => {
    baseEntityFactoryMock.mockImplementation((values) => ({ ...values, id: "id" }));

    const data = {
      name: "foo",
      checked: true,
    };

    const skill = skills(data);

    expect(skill.name).toEqual(data.name);
    expect(skill.checked).toEqual(data.checked);
    expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, "skill");
  });
});
