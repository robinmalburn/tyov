import migrator from 'Migrations/index';
import { 
    SIGNATURE,
    defaultGameState,
    getStateFromStore,
    restoreState,
    serialize,
    deserialize,
 } from 'Libs/gameState';


jest.mock('Migrations/index', () => {
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

const serializedDataProvider = () => { 
    return [
        ['foo', 'IgBmAG8AbwAiAA=='],
        [1,'MQA='],
        [true, 'dAByAHUAZQA='],
        [{foo: 'bar'}, 'ewAiAGYAbwBvACIAOgAiAGIAYQByACIAfQA='],
    ];
};

 describe('lib/gameState.js', () => { 
    afterEach(() => { 
        jest.restoreAllMocks();
    });

    it('Has the expected signature.', () => { 
        expect(SIGNATURE).toEqual(2);
    });

    it('Can return a default game state, or slices of it.', () => { 
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
    ])('Can return a section of default state, or an empty dictionary if an invalid section is requested.', (section, expectedState) => {
        const result = defaultGameState(section);
        expect(result).toEqual(expectedState);
    })

    it('Can get state from a store.', () => { 
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

    it('Can restore state to a store.', async () => { 
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

    it('Can restore state to a store, with existing data.', async () => { 
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

    it.each(serializedDataProvider())('Can serialize data into base64.', (input, output) => {
        const spyStringify = jest.spyOn(JSON, 'stringify');
        const spyBtoA = jest.spyOn(global, 'btoa');

        const result = serialize(input);

        expect(result).toEqual(output);
        expect(spyStringify).toHaveBeenCalledWith(input);
        expect(spyBtoA).toHaveBeenCalled();

        spyStringify.mockRestore();
        spyBtoA.mockRestore();
    });

    it('Throws on failure to serialize.', () => {
        const input = 'foo';
        const spyStringify = jest.spyOn(JSON, 'stringify');
        const spyBtoA = jest.spyOn(global, 'btoa');

        spyStringify.mockImplementation(() => { 
            throw 'Fail';
        });

        expect(() => { 
            serialize(input);
        }).toThrow('Unable to serialize data structure.');

        expect(spyStringify).toHaveBeenCalledWith(input);
        expect(spyBtoA).not.toHaveBeenCalled();

        spyStringify.mockRestore();
        spyBtoA.mockRestore();
    });

    it.each(serializedDataProvider())('Can deserialize data from base64.', (output, input) => { 
        const spyParse = jest.spyOn(JSON, 'parse');
        const spyAtoB = jest.spyOn(global, 'atob');

        const result = deserialize(input);

        expect(result).toEqual(output);
        expect(spyParse).toHaveBeenCalled();
        expect(spyAtoB).toHaveBeenCalledWith(input);

        spyParse.mockRestore();
        spyAtoB.mockRestore();
    });

    it('Throws on failure to deserialize.', () => {
        const spyParse = jest.spyOn(JSON, 'parse');
        const spyAtoB = jest.spyOn(global, 'atob');

        spyParse.mockImplementation(() => { 
            throw 'Fail';
        });

        expect(() => { 
            deserialize('foo');
        }).toThrow('Unable to parse deserialised data.');

        expect(spyParse).toHaveBeenCalled();
        expect(spyAtoB).toHaveBeenCalledWith('foo');

        spyParse.mockRestore();
        spyAtoB.mockRestore();
    });
 });