import { defaultGameState } from 'Libs/gameState';
import { memoryEntityFactory, eventEntityFactory } from 'Libs/entities/memories';
import { findById } from 'Libs/entities';
import Vue from 'vue';

const state = {
    ...defaultGameState('memories'),
};

const getters = {
    active: (state) => state.memories.reduce((accumlator, current) => {
        if (current.forgotten === false && current.diary === '') {
          return accumlator + 1;
        }

        return accumlator;
      }, 0),
    canAddMemories: (state, getters) => getters.active < 5,
    forgottenMemories: (state) => state.memories.filter(memory => memory.forgotten && memory.diary === ''),
    activeMemories: (state) => state.memories.filter(memory => !memory.forgotten && memory.diary === ''),
    events: (state) => (memory) => state.events.filter(event => event.memory === memory.id),
    hasEvents: (state) => (memory) => state.events.some(event => event.memory === memory.id),
};

const mutations = {
    addMemory: (state, memory) => state.memories.push(memoryEntityFactory(memory)),
    setMemories: (state, memories) => state.memories = memories,
    updateMemory: (state, memory) => {
        const found = findById(state.memories, memory.id);
        Vue.set(state.memories, found.idx, memoryEntityFactory(memory));
    },
    removeMemory: (state, memory) => {
        const found = findById(state.memories, memory.id);
        state.memories.splice(found.idx, 1);
    },
    toggleMemory: (state, memory) => {
        const found = findById(state.memories, memory.id);
        Vue.set(found.entity, 'forgotten', !found.entity.forgotten);
    },
    addEvent: (state, event) => state.events.push(eventEntityFactory(event)),
    setEvents: (state, events) => state.events = events,
    updateEvent: (state, event) => {
        const found = findById(state.events, event.id);
        Vue.set(state.events, found.idx, eventEntityFactory(event));
    },
    removeEvent: (state, event) => {
        const found = findById(state.events, event.id);
        state.events.splice(found.idx, 1);
    },
    diarise: (state, {memory, diary}) => {
        const found = findById(state.memories, memory.id);
        Vue.set(found.entity, 'diary', diary.id);
    },
    undiarise: (state, memory) => {
        const found = findById(state.memories, memory.id);
        Vue.set(found.entity, 'diary', '');
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};