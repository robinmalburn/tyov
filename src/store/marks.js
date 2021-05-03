import { defaultGameState } from 'Libs/gameState';
import entityFactory from 'Libs/entities/marks';
import { findById } from 'Libs/entities';

import Vue from 'vue';

const state = {
    ...defaultGameState('marks'),
};

const mutations = {
    add: (state, mark) => state.marks.push(entityFactory(mark)),
    update: (state, updated) => { 
        const found = findById(state.marks, updated.id);
        Vue.set(state.marks, found.idx, entityFactory(updated));
    },
    set: (state, marks) => state.marks = marks,
    remove: (state, mark) => {
        const found = findById(state.marks, mark.id);
        state.marks.splice(found.idx, 1)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
};