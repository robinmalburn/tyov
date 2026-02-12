import migrator from "Migrations";
import { useActionsStore } from "Stores/actions";
import { useCharactersStore } from "Stores/characters";
import { useMarksStore } from "Stores/marks";
import { useMemoriesStore } from "Stores/memories";
import { useResourcesStore } from "Stores/resources";
import { useSkillsStore } from "Stores/skills";

export const SIGNATURE = 2;

export const getStateFromStore = () => {
  const actionsStore = useActionsStore();
  const charactersStore = useCharactersStore();
  const marksStore = useMarksStore();
  const memoriesStore = useMemoriesStore();
  const resourcesStore = useResourcesStore();
  const skillsStore = useSkillsStore();

  return {
    d6: actionsStore.d6,
    d10: actionsStore.d10,
    lastRoll: actionsStore.lastRoll,
    prompts: actionsStore.prompts,
    currentPromptIdx: actionsStore.currentPromptIdx,
    characters: charactersStore.characters,
    marks: marksStore.marks,
    memories: memoriesStore.memories,
    events: memoriesStore.events,
    resources: resourcesStore.resources,
    diaries: resourcesStore.diaries,
    skills: skillsStore.skills,
    __SIGNATURE__: SIGNATURE,
  };
};

export const defaultGameState = (section?: string) => {
  const state: Record<string, Record<string, unknown>> = {
    actions: {
      d6: NaN,
      d10: NaN,
      lastRoll: "?",
      currentPromptIdx: 0,
      prompts: [],
    },
    characters: {
      characters: [],
    },
    marks: {
      marks: [],
    },
    memories: {
      memories: [],
      events: [],
    },
    skills: {
      skills: [],
    },
    resources: {
      resources: [],
      diaries: [],
    },
  };

  if (section) {
    return {
      ...(state[section] ?? {}),
    };
  }

  return {
    ...state.actions,
    ...state.characters,
    ...state.marks,
    ...state.memories,
    ...state.resources,
    ...state.skills,
  };
};

export const restoreState = async (data: Record<string, unknown>) => {
  const actionsStore = useActionsStore();
  const charactersStore = useCharactersStore();
  const marksStore = useMarksStore();
  const memoriesStore = useMemoriesStore();
  const resourcesStore = useResourcesStore();
  const skillsStore = useSkillsStore();

  let nextData: Record<string, unknown> = {
    ...defaultGameState(),
    ...data,
  };

  nextData = await migrator.migrate(nextData, SIGNATURE);

  actionsStore.saveRoll((nextData.lastRoll as string) ?? "?");

  actionsStore.setD6((nextData.d6 as number) ?? NaN);
  actionsStore.setD10((nextData.d10 as number) ?? NaN);

  actionsStore.setCurrentPromptIdx((nextData.currentPromptIdx as number) ?? 0);

  const prompts = Array.isArray(nextData.prompts) ? nextData.prompts : [];

  prompts.forEach((prompt) => {
    prompt.page = parseInt(prompt.page, 10);
    prompt.count = parseInt(prompt.count, 10);
  });

  actionsStore.setPrompts(prompts);

  charactersStore.set(
    Array.isArray(nextData.characters) ? nextData.characters : [],
  );

  marksStore.set(Array.isArray(nextData.marks) ? nextData.marks : []);

  memoriesStore.setMemories(
    Array.isArray(nextData.memories) ? nextData.memories : [],
  );

  memoriesStore.setEvents(
    Array.isArray(nextData.events) ? nextData.events : [],
  );

  resourcesStore.setResources(
    Array.isArray(nextData.resources) ? nextData.resources : [],
  );

  resourcesStore.setDiaries(
    Array.isArray(nextData.diaries) ? nextData.diaries : [],
  );

  skillsStore.set(Array.isArray(nextData.skills) ? nextData.skills : []);
};

/**
 * Serializes the data for saving.
 *
 * @param data Data to serialise
 * @returns string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
 */
export const serialize = (data: unknown): string => {
  let raw: string;

  try {
    raw = JSON.stringify(data);
  } catch (err) {
    throw "Unable to serialize data structure.";
  }

  const dataLength = raw.length;
  const codePoints = new Uint16Array(dataLength);

  for (let i = 0; i < dataLength; i++) {
    codePoints[i] = raw.charCodeAt(i);
  }

  return btoa(String.fromCharCode(...new Uint8Array(codePoints.buffer)));
};

/**
 * Desirailizes the data for consumption.
 *
 * @param data Data to deserialise
 * @returns Object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
 */
export const deserialize = (data: string): Record<string, unknown> => {
  const raw = atob(data);
  const dataLength = raw.length;
  const codePoints = new Uint8Array(dataLength);

  for (let i = 0; i < dataLength; i++) {
    codePoints[i] = raw.charCodeAt(i);
  }

  try {
    return JSON.parse(
      String.fromCharCode(...new Uint16Array(codePoints.buffer)),
    );
  } catch (err) {
    throw "Unable to parse deserialised data.";
  }
};
