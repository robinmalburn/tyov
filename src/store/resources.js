import { defaultGameState } from 'Libs/gameState';
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
    isDiaryFull: (state, getters) => getters.diary.memories.filter(memory => !memory.forgotten).length >= 4,
}

const mutations = {
    addResource: (state, resource) => state.resources.push(resource),
    setResources: (state, resources) => state.resources = resources,
    removeResource: (state, resource) => {
        const idx = state.resources.indexOf(resource);
        state.resources.splice(idx, 1);
    },
    toggleResource: (state, resource) => Vue.set(resource, 'lost', !resource.lost),
    addDiary: (state, diary) => state.diaries.push(diary),
    addMemoryToDiary: (state, {diary, memory}) => diary.memories.push(memory),
    removeMemoryFromDiary: (state, {diary, memory}) => {
        const idx = diary.memories.indexOf(memory);
        diary.memories.splice(idx, 1);
    },
    setDiaries: (state, diaries) => state.diaries = diaries,
    removeDiary: (state, diary) => {
        const idx = state.diaries.indexOf(diary);
        state.diaries.splice(idx, 1);
    },
    toggleDiary: (state, diary) => Vue.set(diary, 'lost', !diary.lost),
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};