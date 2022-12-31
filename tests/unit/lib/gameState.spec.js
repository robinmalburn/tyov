import migrator from 'Migrations';
import { 
    SIGNATURE,
    defaultGameState,
    getStateFromStore,
    restoreState,
 } from 'Libs/gameState';


jest.mock('Migrations', () => {
    return {
      __esModule: true,
      default: {
        migrate: jest.fn((data) => data),
      },
    };
});

const STATE = { 
    actions: {
        d6: NaN,
        d10: NaN,
        lastRoll: '?',
        currentPromptIdx: 0,
        prompts: []
    },
    characters: {
        characters: []
    },
    marks: {
        marks: [],
    },
    memories: {
        memories: [],
        events: [],
    },
    skills: {
        skills: []
    },
    resources: {
        resources: [],
        diaries: [],
    },
};

 describe('lib/gameState.js', () => { 
    afterEach(() => { 
        jest.restoreAllMocks();
    });

    it('To have the expected signature.', () => { 
        expect(SIGNATURE).toEqual(2);
    });

    it('To return a default game state, or slices of it.', () => { 
        const expectedState = {
            ...STATE.actions,
            ...STATE.characters,
            ...STATE.marks,
            ...STATE.memories,
            ...STATE.resources,
            ...STATE.skills
        };

        const result = defaultGameState();
        expect(result).toEqual(expectedState);
    });

    it.each([
        ['foo', {}],
        ['actions', STATE.actions],
        ['characters', STATE.characters],
        ['marks', STATE.marks],
        ['memories', STATE.memories],
        ['resources', STATE.resources],
        ['skills', STATE.skills],
    ])('To return a section of default state, or an empty dictionary if an invalid section is requested.', (section, expectedState) => {
        const result = defaultGameState(section);
        expect(result).toEqual(expectedState);
    })

    it('To be able to get state from a store.', () => { 
        const store = {
                state: STATE,
            };

        const expected = {
            ...STATE.actions,
            ...STATE.characters,
            ...STATE.marks,
            ...STATE.memories,
            ...STATE.resources,
            ...STATE.skills,
            __SIGNATURE__: SIGNATURE
        };

        const result = getStateFromStore(store);

        expect(result).toEqual(expected);
                
    });

    it('To be able to restore state to a store.', async () => { 
        const commit = jest.fn();
        const store = {commit};
        const data = {};

        await restoreState(store, data);

        expect(migrator.migrate).toHaveBeenCalled();
        expect(commit).toHaveBeenCalledTimes(12);
        expect(commit).toHaveBeenNthCalledWith(1, 'actions/saveRoll', STATE.actions.lastRoll);
        expect(commit).toHaveBeenNthCalledWith(2, 'actions/setD6', STATE.actions.d6);
        expect(commit).toHaveBeenNthCalledWith(3, 'actions/setD10', STATE.actions.d10);
        expect(commit).toHaveBeenNthCalledWith(4, 'actions/setCurrentPromptIdx', STATE.actions.currentPromptIdx);
        expect(commit).toHaveBeenNthCalledWith(5, 'actions/setPrompts', STATE.actions.prompts);
        expect(commit).toHaveBeenNthCalledWith(6, 'characters/set', STATE.characters.characters);
        expect(commit).toHaveBeenNthCalledWith(7, 'marks/set', STATE.marks.marks);
        expect(commit).toHaveBeenNthCalledWith(8, 'memories/setMemories', STATE.memories.memories);
        expect(commit).toHaveBeenNthCalledWith(9, 'memories/setEvents', STATE.memories.events);
        expect(commit).toHaveBeenNthCalledWith(10, 'resources/setResources', STATE.resources.resources);
        expect(commit).toHaveBeenNthCalledWith(11, 'resources/setDiaries', STATE.resources.diaries);
        expect(commit).toHaveBeenNthCalledWith(12, 'skills/set', STATE.skills.skills);

        commit.mockRestore();
    });

    it('To be able to restore state to a store, with existing data.', async () => { 
        const commit = jest.fn();
        const store = {commit};
        const data = {
          d6: 1,
          d10: 2,
          lastRoll: "3",
          currentPromptIdx: 4,
          prompts: [{page:5, count: 1}, {page:6, count:2}],
        };

        await restoreState(store, data);

        expect(migrator.migrate).toHaveBeenCalled();
        expect(commit).toHaveBeenCalledTimes(12);
        expect(commit).toHaveBeenNthCalledWith(1, 'actions/saveRoll', data.lastRoll);
        expect(commit).toHaveBeenNthCalledWith(2, 'actions/setD6', data.d6);
        expect(commit).toHaveBeenNthCalledWith(3, 'actions/setD10', data.d10);
        expect(commit).toHaveBeenNthCalledWith(4, 'actions/setCurrentPromptIdx', data.currentPromptIdx);
        expect(commit).toHaveBeenNthCalledWith(5, 'actions/setPrompts', data.prompts);
        expect(commit).toHaveBeenNthCalledWith(6, 'characters/set', STATE.characters.characters);
        expect(commit).toHaveBeenNthCalledWith(7, 'marks/set', STATE.marks.marks);
        expect(commit).toHaveBeenNthCalledWith(8, 'memories/setMemories', STATE.memories.memories);
        expect(commit).toHaveBeenNthCalledWith(9, 'memories/setEvents', STATE.memories.events);
        expect(commit).toHaveBeenNthCalledWith(10, 'resources/setResources', STATE.resources.resources);
        expect(commit).toHaveBeenNthCalledWith(11, 'resources/setDiaries', STATE.resources.diaries);
        expect(commit).toHaveBeenNthCalledWith(12, 'skills/set', STATE.skills.skills);

        commit.mockRestore();
    });
 });