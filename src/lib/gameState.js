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

export const defaultGameState = (section) => {
  const state = {
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

export const restoreState = async (data) => {
  const actionsStore = useActionsStore();
  const charactersStore = useCharactersStore();
  const marksStore = useMarksStore();
  const memoriesStore = useMemoriesStore();
  const resourcesStore = useResourcesStore();
  const skillsStore = useSkillsStore();

  data = {
    ...defaultGameState(),
    ...data,
  };

  data = await migrator.migrate(data, SIGNATURE);

  actionsStore.saveRoll(data.lastRoll ?? "?");

  actionsStore.setD6(data.d6 ?? NaN);
  actionsStore.setD10(data.d10 ?? NaN);

  actionsStore.setCurrentPromptIdx(data.currentPromptIdx ?? 0);

  const prompts = Array.isArray(data.prompts) ? data.prompts : [];

  prompts.forEach((prompt) => {
    prompt.page = parseInt(prompt.page, 10);
    prompt.count = parseInt(prompt.count, 10);
  });

  actionsStore.setPrompts(prompts);

  charactersStore.set(Array.isArray(data.characters) ? data.characters : []);

  marksStore.set(Array.isArray(data.marks) ? data.marks : []);

  memoriesStore.setMemories(Array.isArray(data.memories) ? data.memories : []);

  memoriesStore.setEvents(Array.isArray(data.events) ? data.events : []);

  resourcesStore.setResources(
    Array.isArray(data.resources) ? data.resources : []
  );

  resourcesStore.setDiaries(Array.isArray(data.diaries) ? data.diaries : []);

  skillsStore.set(Array.isArray(data.skills) ? data.skills : []);
};

/**
 * Serializes the data for saving.
 *
 * @param {Object} data Data to serialise
 * @returns string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
 */
export const serialize = (data) => {
  let raw;

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
 * @param {String} data Data to deserialise
 * @returns Object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
 */
export const deserialize = (data) => {
  const raw = atob(data);
  const dataLength = raw.length;
  const codePoints = new Uint8Array(dataLength);

  for (let i = 0; i < dataLength; i++) {
    codePoints[i] = raw.charCodeAt(i);
  }

  try {
    return JSON.parse(
      String.fromCharCode(...new Uint16Array(codePoints.buffer))
    );
  } catch (err) {
    throw "Unable to parse deserialised data.";
  }
};
