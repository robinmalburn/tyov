import { baseEntityFactory } from 'Libs/entities';
import {
    memoryEntityFactory,
    eventEntityFactory
 } from 'Libs/entities/memories';

jest.mock('Libs/entities');

describe('lib/entities/memories.js', () => {
    describe('Test suite for memory entities', () => {
        it('Can create a default memory entity.', () => { 
            const memory = memoryEntityFactory();

            expect(memory.description).toEqual('');
            expect(memory.forgotten).toEqual(false);
            expect(memory.diary).toEqual('');
            expect(baseEntityFactory).toHaveBeenCalledWith({}, 'memory');
        });
        
        it('Can create a memory entity with injected data.', () => { 
            baseEntityFactory.mockImplementation((values) => values);

            const data = {
                description: 'foo',
                diary: 'bar',
                forgotten: true
            };

            const memory = memoryEntityFactory(data);

            expect(memory.description).toEqual(data.description);
            expect(memory.forgotten).toEqual(data.forgotten);
            expect(memory.diary).toEqual(data.diary);
            expect(baseEntityFactory).toHaveBeenCalledWith(data, 'memory');
        });
    });

    describe('Test suite for event entities', () => {
        it('Can create a default event entity.', () => { 
            const event = eventEntityFactory();

            expect(event.description).toEqual('');
            expect(event.memory).toEqual('');
            expect(baseEntityFactory).toHaveBeenCalledWith({}, 'event');
        });
        
        it('Can create a event entity with injected data.', () => { 
            baseEntityFactory.mockImplementation((values) => values);

            const data = {
                description: 'foo',
                memory: 'bar',
            };

            const event = eventEntityFactory(data);

            expect(event.description).toEqual(data.description);
            expect(event.memory).toEqual(data.memory);
            expect(baseEntityFactory).toHaveBeenCalledWith(data, 'event');
        });
    });
    describe('Test suite for memory entities', () => {
        it('Can create a default memory entity.', () => { 
            const memory = memoryEntityFactory();

            expect(memory.description).toEqual('');
            expect(memory.forgotten).toEqual(false);
            expect(memory.diary).toEqual('');
            expect(baseEntityFactory).toHaveBeenCalledWith({}, 'memory');
        });
        
        it('Can create a memory entity with injected data.', () => { 
            baseEntityFactory.mockImplementation((values) => values);

            const data = {
                description: 'foo',
                diary: 'bar',
                forgotten: true
            };

            const memory = memoryEntityFactory(data);

            expect(memory.description).toEqual(data.description);
            expect(memory.forgotten).toEqual(data.forgotten);
            expect(memory.diary).toEqual(data.diary);
            expect(baseEntityFactory).toHaveBeenCalledWith(data, 'memory');
        });
    });
});