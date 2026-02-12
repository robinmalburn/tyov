import uuid from "Libs/uuid";

export type EntityRecord = Record<string, any>;

export type EntityWithId<T extends EntityRecord> = T & { id: string };

export const baseEntityFactory = <T extends EntityRecord>(
  data: T,
  ns = "uuid"
): EntityWithId<T> => {
  const entity = deepCopy(data);

  if (!data.id) {
    (entity as EntityWithId<T>).id = uuid(ns);
  }

  return entity as EntityWithId<T>;
};

export const shallowCopy = <T>(data: T): T => {
  if (data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return Array.from(data) as T;
  }

  if (typeof data === "object") {
    return { ...(data as Record<string, unknown>) } as T;
  }

  return data;
};

export const deepCopy = <T>(data: T): T => {
  if (data === null) {
    return data;
  }

  try {
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error(
      `Error with deep data copy, falling back to shallow copy.  Error: ${err}`
    );

    return shallowCopy(data);
  }
};

export const hasId = <T extends EntityRecord>(
  data: T[],
  value: unknown,
  key = "id"
): boolean => {
  return data.some((item) => {
    return item[key] === value;
  });
};

export const findById = <T extends EntityRecord>(
  data: T[],
  value: unknown,
  key = "id"
): { entity: T | null; idx: number | null } => {
  let result: { entity: T | null; idx: number | null } = {
    entity: null,
    idx: null,
  };

  data.some((item, idx) => {
    if (item[key] === value) {
      result = { entity: item, idx };
      return true;
    }
    return false;
  });

  return result;
};
