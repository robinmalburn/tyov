import migrator from 'Migrations';

export const SIGNATURE = 1;

export const getStateFromStore = (store) => {
    return {
        d6: store.state.actions.d6,
        d10: store.state.actions.d10,
        lastRoll: store.state.actions.lastRoll,
        prompts: store.state.actions.prompts,
        currentPromptIdx: store.state.actions.currentPromptIdx,
        characters: store.state.characters.characters,
        marks: store.state.marks.marks,
        memories: store.state.memories.memories,
        resources: store.state.resources.resources,
        diaries: store.state.resources.diaries,
        skills: store.state.skills.skills,
        __SIGNATURE__: SIGNATURE,
    };
};

export const defaultGameState = (section) => {
    const state = { 
        actions: {
            d6: NaN,
            d10: NaN,
            lastRoll: '?',
            currentPromptIdx: 0,
            prompts: []
        },
        characters: {
            characters: []
        },
        marks: {
            marks: [],
        },
        memories: {
            memories: [],
        },
        skills: {
            skills: []
        },
        resources: {
            resources: [],
            diaries: [],
        },
    }

    if (section) {
        return {
            ...state[section] ?? {}
        }
    }

    return {
        ...state.actions,
        ...state.characters,
        ...state.marks,
        ...state.memories,
        ...state.resources,
        ...state.skills
    }
}

export const restoreState = (store, data) => {
    data =  {
        ...defaultGameState(),
        ...data,
    };

    data = migrator.migrate(data);

    store.commit('actions/saveRoll', data.lastRoll ?? '?');

    store.commit('actions/setD6', data.d6 ?? NaN);

    store.commit('actions/setD6', data.d6 ?? NaN);

    store.commit('actions/setCurrentPromptIdx', data.currentPromptIdx ?? 0);
    
    store.commit('actions/setPrompts', Array.isArray(data.prompts) ? data.prompts : []);

    store.commit('characters/set', Array.isArray(data.characters) ? data.characters : []);

    store.commit('marks/set', Array.isArray(data.marks) ? data.marks : []);

    store.commit('memories/set', Array.isArray(data.memories) ? data.memories : []);

    store.commit('resources/setResources', Array.isArray(data.resources) ? data.resources : []);

    store.commit('resources/setDiaries', Array.isArray(data.diaries) ? data.diaries : []);

    store.commit('skills/set', Array.isArray(data.skills) ? data.skills : []);
}

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
        throw 'Unable to serialize data structure.';
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
        return JSON.parse(String.fromCharCode(...new Uint16Array(codePoints.buffer)))
    } catch (err) {
        throw 'Unable to parse deserialised data.'
    }
}