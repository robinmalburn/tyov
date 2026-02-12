import { baseEntityFactory, type EntityWithId } from "Libs/entities";

const NS = "prompt";

export type Prompt = EntityWithId<{
  page: number;
  count: number;
}>;

export default (data: Partial<Prompt> = {}): Prompt => {
  return {
    page: 1,
    count: 0,
    ...baseEntityFactory(data, NS),
  };
};
