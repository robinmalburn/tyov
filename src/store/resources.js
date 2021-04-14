import { defaultGameState } from 'Libs/gameState';

const state = {
    ...defaultGameState('resources'),
};

const getters = {
    diary: state => state.diaries.filter(diary => !diary.lost)[0] || null,
    lostDiaries: (state) => state.diaries.filter(diary => diary.lost),
    hasDiary: (state, getters) =>  getters.diary !== null,
    isDiaryFull: (state, getters) => getters.diary.memories.filter(memory => !memory.forgotten).length >= 4,
}

const mutations = {
    addResource: (state, resource) => state.resources.push(resource),
    setResources: (state, resources) => state.resources = resources,
    removeResource: (state, idx) => state.resources.splice(idx, 1),
    toggleResource: (state, idx) => state.resources[idx].lost = !state.resources[idx].lost,
    addDiary: (state, diary) => state.diaries.push(diary),
    addMemoryToDiary: (state, {diary, memory}) => diary.memories.push(memory),
    removeMemoryFromDiary: (state, {diary, idx}) => diary.memories.splice(idx, 1),
    setDiaries: (state, diaries) => state.diaries = diaries,
    removeDiary: (state, idx) => state.diaries.splice(idx, 1),
    toggleDiary: (state, idx) => state.diaries[idx].lost = !state.diaries[idx].lost,
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};