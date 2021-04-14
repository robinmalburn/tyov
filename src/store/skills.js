import { defaultGameState } from 'Libs/gameState';

const state = {
    ...defaultGameState('skills'),
};

const mutations = {
    add: (state, skill) => state.skills.push(skill),
    set: (state, skills) => state.skills = skills,
    remove: (state, idx) => state.skills.splice(idx, 1),
    toggle: (state, idx) => state.skills[idx].checked = !state.skills[idx].checked,
}

export default {
    namespaced: true,
    state,
    mutations,
};