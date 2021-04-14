import { defaultGameState } from 'Libs/gameState';

const state = {
    ...defaultGameState('characters'),
};

const mutations = {
    add: (state, character) => state.characters.push(character),
    set: (state, characters) => state.characters = characters,
    remove: (state, idx) => state.characters.splice(idx, 1),
    toggle: (state, idx) => state.characters[idx].dead = !state.characters[idx].dead,
}

export default {
    namespaced: true,
    state,
    mutations,
};