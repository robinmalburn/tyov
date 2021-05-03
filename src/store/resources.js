import { defaultGameState } from 'Libs/gameState';
import { resourceEntityFactory, diaryEntityFactory } from 'Libs/entities/resources';
import { findById } from 'Libs/entities';
import Vue from 'vue';

const state = {
    ...defaultGameState('resources'),
};

const getters = {
    resources: (state) => [...state.resources].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
            return 1;
        }

        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
            return -1;
        }

        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name);
    }),
    diaries: (state) => [...state.diaries].sort((a, b) => {
        // If a is not lost, move it up the array.
        if (a.lost && !b.lost) {
            return 1;
        }

        //If a is lost, move it down the array.
        if (!a.lost && b.lost) {
            return -1;
        }

        // Finally, sort alphabetically.
        return a.name.localeCompare(b.name);
    }),
    diary: state => state.diaries.filter(diary => !diary.lost)[0] || null,
    lostDiaries: (state) => state.diaries.filter(diary => diary.lost),
    hasDiary: (state, getters) =>  getters.diary !== null,
    memories: (state, getters, rootState) => {
        return rootState.memories.memories.filter(memory => {
            return memory.diary === getters.diary.id;
        });
    },
    activeMemories: (state, getters) => getters.memories.filter(memory => !memory.forgotten),
    forgottenMemories: (state, getters) => getters.memories.filter(memory => memory.forgotten),
    isDiaryFull: (state, getters) => {
        let count = 0;
        return getters.memories.some(memory => {
            if (!memory.lost) {
                count += 1;
            }
            return count >= 4;
        })
    }
}

const mutations = {
    addResource: (state, resource) => state.resources.push(resourceEntityFactory(resource)),
    setResources: (state, resources) => state.resources = resources,
    updateResource: (state, updated) => { 
        const found = findById(state.resources, updated.id);
        Vue.set(state.resources, found.idx, resourceEntityFactory(updated));
    },
    removeResource: (state, resource) => {
        const found = findById(state.resources, resource.id);
        state.resources.splice(found.idx, 1);
    },
    toggleResource: (state, resource) => {
        const found = findById(state.resources, resource.id);
        Vue.set(found.entity, 'lost', !found.entity.lost);
    },
    addDiary: (state, diary) => state.diaries.push(diaryEntityFactory(diary)),
    updateDiary: (state, updated) => { 
        const found = findById(state.diaries, updated.id);
        Vue.set(state.diaries, found.idx, diaryEntityFactory(updated));
    },
    setDiaries: (state, diaries) => state.diaries = diaries,
    removeDiary: (state, diary) => {
        const found = findById(state.diaries, diary.id);
        state.diaries.splice(found.idx, 1);
    },
    toggleDiary: (state, diary) => {
        const found = findById(state.diaries, diary.id);
        Vue.set(found.entity, 'lost', !found.entity.lost);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};