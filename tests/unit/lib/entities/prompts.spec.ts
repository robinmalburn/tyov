import { describe, it, expect, vi, afterEach } from "vitest";
import { baseEntityFactory } from "Libs/entities";
import prompts from "Libs/entities/prompts";

vi.mock("Libs/entities");

const baseEntityFactoryMock = vi.mocked(baseEntityFactory);

describe("lib/entities/prompts.js", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Can create a default prompt entity.", () => {
    const prompt = prompts();

    expect(prompt.page).toEqual(1);
    expect(prompt.count).toEqual(0);
    expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, "prompt");
  });

  it("Can create a prompt entity with injected data.", () => {
    baseEntityFactoryMock.mockImplementation((values) => ({ ...values, id: "id" }));

    const data = {
      page: 10,
      count: 2,
    };

    const prompt = prompts(data);

    expect(prompt.page).toEqual(data.page);
    expect(prompt.count).toEqual(data.count);
    expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, "prompt");
  });
});
