import { baseEntityFactory, type EntityWithId } from "Libs/entities";

const NS = "skill";

export type Skill = EntityWithId<{
  name: string;
  checked: boolean;
}>;

export default (data: Partial<Skill> = {}): Skill => {
  return {
    name: "",
    checked: false,
    ...baseEntityFactory(data, NS),
  };
};
