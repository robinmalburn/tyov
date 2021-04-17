import { defaultGameState } from 'Libs/gameState';
import Vue from 'vue';

const state = {
    ...defaultGameState('skills'),
};

const getters = {
    skills: (state) => [...state.skills].sort((a, b) => { 
        if ((a.checked && b.checked) || (!a.checked && !b.checked)) {
            return a.name.localeCompare(b.name);
        }

        return a.checked && !b.checked ? 1 : -1;
    })
};

const mutations = {
    add: (state, skill) => state.skills.push(skill),
    set: (state, skills) => state.skills = skills,
    update: (state, updated) => {
        let foundIdx;
        state.skills.some((skill, idx) => {
            if (skill.id === updated.id) {
                foundIdx = idx;
                return true;
            }
        });

        Vue.set(state.skills, foundIdx, updated);
    },
    remove: (state, skill) => {
        const idx = state.skills.indexOf(skill);
        state.skills.splice(idx, 1)
    },
    toggle: (state, skill) => Vue.set(skill, 'checked', !skill.checked),
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
};