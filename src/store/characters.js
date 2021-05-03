import { defaultGameState } from 'Libs/gameState';
import entityFactory from 'Libs/entities/characters';
import { findById } from 'Libs/entities';
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
    add: (state, character) => state.characters.push(entityFactory(character)),
    update: (state, update) => {
        const found = findById(state.characters, update.id);
        Vue.set(state.characters, found.idx, entityFactory(update));
    },
    set: (state, characters) => state.characters = characters,
    remove: (state, character) => {
        const found = findById(state.characters, character.id);
        state.characters.splice(found.idx, 1)
    },
    toggle: (state, character) => {
        const found = findById(state.characters, character.id);
        Vue.set(found.entity,'dead', !found.entity.dead);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};