import { defaultGameState } from 'Libs/gameState';

const state = {
    ...defaultGameState('marks'),
};

const mutations = {
    add: (state, mark) => state.marks.push(mark),
    set: (state, marks) => state.marks = marks,
    remove: (state, mark) => {
        const idx = state.marks.indexOf(mark);
        state.marks.splice(idx, 1)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
};