import { defaultGameState } from 'Libs/gameState';
import Vue from 'vue';

const state = {
    ...defaultGameState('memories'),
};

const getters = {
    active: (state) => state.memories.reduce((accumlator, current) => {
        if (current.forgotten === false && current.diarised === false) {
          return accumlator + 1;
        }

        return accumlator;
      }, 0),
    canAdd: (state, getters) => getters.active < 5,
    forgottenMemories: (state) => state.memories.filter(memory => memory.forgotten && !memory.diarised),
    activeMemories: (state) => state.memories.filter(memory => !memory.forgotten && !memory.diarised),
};

const mutations = {
    add: (state, memory) => state.memories.push(memory),
    set: (state, memories) => state.memories = memories,
    remove: (state, memory) => {
        const idx = state.memories.indexOf(memory);
        state.memories.splice(idx, 1);
    },
    toggle: (state, memory) => Vue.set(memory, 'forgotten', !memory.forgotten),
    addEvent: (state, {memory, event}) => memory.events.push(event),
    removeEvent: (state, {memory, event}) => {
        const idx = memory.events.indexOf(event);
        memory.events.splice(idx, 1);
    },
    diarise: (state, memory) => Vue.set(memory, 'diarised', true),
    undiarise: (state, memory) => Vue.set(memory, 'diarised', false),
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};