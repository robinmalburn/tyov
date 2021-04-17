import { defaultGameState } from 'Libs/gameState';
import Vue from 'vue';

const state = {
    ...defaultGameState('marks'),
};

const mutations = {
    add: (state, mark) => state.marks.push(mark),
    update: (state, updated) => { 
        let foundIdx;
        state.marks.some((mark, idx) => {
            if (mark.id === updated.id) {
                foundIdx = idx;
                return true;
            }
        });

        Vue.set(state.marks, foundIdx, updated);
    },
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