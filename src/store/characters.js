import { defaultGameState } from 'Libs/gameState';
import { findById } from 'Libs/uuid';
import Vue from 'vue';

const state = {
    ...defaultGameState('characters'),
};

const getters = {
    characters: (state) => [...state.characters].sort((a, b) => {
        if (a.dead && !b.dead) {
            return 1;
        }

        if (!a.dead && b.dead) {
            return -1;
        }

        return a.name.localeCompare(b.name);
    }),
}

const mutations = {
    add: (state, character) => state.characters.push(character),
    update: (state, update) => {
        const found = findById(state.characters, update.id);
        Vue.set(state.characters, found.idx, update);
    },
    set: (state, characters) => state.characters = characters,
    remove: (state, character) => {
        const found = findById(state.characters, character.id);
        state.characters.splice(found.idx, 1)
    },
    toggle: (state, character) => Vue.set(character,'dead', !character.dead),
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};