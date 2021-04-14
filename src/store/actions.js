import { randomRange } from 'Libs/random';
import { defaultGameState } from 'Libs/gameState';

const state = {
    ...defaultGameState('actions'),
};

const getters = {
    die: (state,) => state.d10 - state.d6,
    currentRoll: (state, getters) => {
        if (isNaN(getters.die)) {
            return '?'
        } 

        return `${getters.die} (+${state.d10}, -${state.d6})`;
    },
    prompts: (state) => {
        const prompts = [...state.prompts.values()];

        return prompts.sort((a, b) => a.page > b.page ? -1 : 1);
    },
    currentPrompt: (state) => state.prompts[state.currentPromptIdx] ?? {},
};

const mutations = {
    rollD6: (state) => state.d6 = randomRange(1, 6),
    setD6: (state, value) => state.d6 = value,
    setD10: (state, value) => state.d10 = value,
    rollD10: (state) => state.d10 = randomRange(1, 10),
    saveRoll: (state, roll) => state.lastRoll = roll,
    makePrompt: (state, prompt) => state.prompts.push({page: prompt, name: `p${prompt}`, count: 0}),
    addPrompt: (state, prompt) => state.prompts.push(prompt),
    setPrompts: (state, prompts) => state.prompts = prompts,
    incrementPrompt: (state, prompt) => state.prompts[prompt].count += 1,
    setCurrentPromptIdx: (state, idx) => state.currentPromptIdx = idx,
}

const actions = {
     roll: ({commit, getters, state}) => {
        commit('saveRoll', getters.currentRoll);
        commit('rollD6');
        commit('rollD10');

        let newPrompt = (getters.currentPrompt && getters.currentPrompt.page) ?? 0;

        newPrompt += getters.die;

        if (newPrompt <= 0) {
            newPrompt = 1;
        }

        var promptIdx = state.currentPromptIdx;

        const promptFound = state.prompts.some((prompt, idx) => {
            if (prompt.page === newPrompt) {
                promptIdx = idx;
                if (prompt.count === 3) {
                    promptIdx += 1;
                    newPrompt += 1;
                }
                return true;
            }
        });

        if (!promptFound) {
            promptIdx = state.prompts.length;
        }

        if (!state.prompts[promptIdx]) {
            commit ('makePrompt', newPrompt);
        }

        commit('incrementPrompt', promptIdx);
        commit('setCurrentPromptIdx', promptIdx);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};