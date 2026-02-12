import { baseEntityFactory, type EntityWithId } from "Libs/entities";

const NS = "mark";

export type Mark = EntityWithId<{
  description: string;
}>;

export default (data: Partial<Mark> = {}): Mark => {
  return {
    description: "",
    ...baseEntityFactory(data, NS),
  };
};
