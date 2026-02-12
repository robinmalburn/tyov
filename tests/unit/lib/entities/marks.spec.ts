import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { baseEntityFactory } from "Libs/entities";
import marks from "Libs/entities/marks";

vi.mock("Libs/entities");

const baseEntityFactoryMock = vi.mocked(baseEntityFactory);

describe("lib/entities/marks.js", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Can create a default mark entity.", () => {
    const mark = marks();

    expect(mark.description).toEqual("");
    expect(baseEntityFactoryMock).toHaveBeenCalledWith({}, "mark");
  });

  it("Can create a mark entity with injected data.", () => {
    baseEntityFactoryMock.mockImplementation((values) => ({ ...values, id: "id" }));

    const data = {
      description: "foo",
    };

    const mark = marks(data);

    expect(mark.description).toEqual(data.description);
    expect(baseEntityFactoryMock).toHaveBeenCalledWith(data, "mark");
  });
});
