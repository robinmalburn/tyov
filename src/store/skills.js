import { defaultGameState } from 'Libs/gameState';
import entityFactory from 'Libs/entities/skills';
import { findById } from 'Libs/entities';
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
    add: (state, skill) => state.skills.push(entityFactory(skill)),
    set: (state, skills) => state.skills = skills,
    update: (state, updated) => {
        const found = findById(state.skills, updated.id);
        Vue.set(state.skills, found.idx, entityFactory(updated));
    },
    remove: (state, skill) => {
        const found = findById(state.skills, skill.id);
        state.skills.splice(found.idx, 1)
    },
    toggle: (state, skill) => {
        const found = findById(state.skills, skill.id);
        Vue.set(found.entity, 'checked', !found.entity.checked);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
};