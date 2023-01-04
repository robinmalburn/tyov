import uuid from 'Libs/uuid';
import { 
    hasId,
    findById,
    shallowCopy,
    deepCopy,
    baseEntityFactory,
} from 'Libs/entities';

jest.mock('Libs/uuid', () => { 
    return { 
        __esModule: true,
        default: jest.fn().mockImplementation((ns) => `uuid-${ns}`)
    };
});

describe('lib/entities/index.js', () => { 

    describe('Test suite for the hasId function.', () => {
        it('Can determine if data has the given ID.', () => { 
            const data = [{
                id: 'foo'
            }];

            expect(hasId(data, 'foo')).toEqual(true);
            expect(hasId(data, 'bar')).toEqual(false);
        });

        it('Can determine if data has the given ID, using a custom key.', () => { 
            const data = [{
                someKey: 'foo'
            }];

            expect(hasId(data, 'foo')).toEqual(false);
            expect(hasId(data, 'foo', 'someKey')).toEqual(true);
            expect(hasId(data, 'bar', 'someKey')).toEqual(false);
        });
    });

    describe('Test suite for the findById function.', () => {
        it('Can find an entity by ID.', () => {
            const entity = {
                id: 'foo',
            };
            const data = [{id: 'bar'}, entity];

            const barResult = findById(data, 'bar');
            const fooResult = findById(data, 'foo');

            expect(barResult.entity).toEqual({id: 'bar'});
            expect(barResult.idx).toEqual(0);
            expect(fooResult.entity).toBe(entity);
            expect(fooResult.idx).toEqual(1);
        });

        it('Can fallback to a null entity when an ID cannot be found.', () => { 
            const result = findById([], 'foo');
            expect(result.entity).toEqual(null);
            expect(result.idx).toEqual(null);       
        });

        it('Can find an entity by ID, using a custom key.', () => {
            const entity = {
                someKey: 'foo',
            };
            const data = [entity];

            const result = findById(data, 'foo', 'someKey');

            expect(result.entity).toBe(entity);
            expect(result.idx).toEqual(0);
        });
    });

    describe('Test suite for shallowCopy and deepCopy functions.', () => {
        it.each([
            [null],
            ['foo'],
            [['foo', 'bar']],
            [{foo: 'bar'}],
        ])('Can shallow copy data.', (data) => {
            const result = shallowCopy(data);

            expect(result).toEqual(data);

            if (data !== null && (Array.isArray(data) || typeof data === 'object')) {
                expect(result).not.toBe(data);
            }
        });

        it.each([
            [null],
            ['foo'],
            [[['foo'],['bar']]],
            [{foo: 'bar'}],
            [{foo: { bar: 'baz' }}],
        ])('Can deep copy data.', (data) => {
            const result = deepCopy(data);

            expect(result).toEqual(data);

            if (Array.isArray(data)) {
                expect(result).not.toBe(data);
                result.forEach((item, idx) => {
                    expect(item).not.toBe(data[idx]);
                    expect(item).toEqual(data[idx]);
                });         
            } else if (data !== null && typeof data === 'object') {
                expect(result).not.toBe(data);
                Object.keys(result).forEach(key => {
                    if (typeof result[key] === 'object') {
                        expect(result[key]).not.toBe(data[key]);
                    }
                    expect(result[key]).toEqual(data[key]);
                });
            }
        });

        it('Can fallback to shallow copy if deep copy fails', () => { 
            const inner = {
                bar: 'baz'
            };

            const data = {'foo': inner};

            const spyStringify = jest.spyOn(JSON, 'stringify');
            spyStringify.mockImplementation(() => { throw 'fail' });

            const result = deepCopy(data);

            expect(spyStringify).toHaveBeenCalledWith(data);
            expect(result).toEqual(data);
            expect(result.foo).toBe(inner);

            spyStringify.mockReset();
        });
    });

    describe('Test suite for base entity factory.', () => { 
        it('Can create a base entity with a default namespace.', () => { 
            const data = {id: 'foo', name: 'bar'};

            const entity = baseEntityFactory(data);

            expect(entity).not.toBe(data);
            expect(entity).toEqual(data);
        });

        it('Can create a base entity with a new UUID.', () => { 
            const data = {name: 'bar'};

            const entity = baseEntityFactory(data);

            expect(uuid).toHaveBeenCalledWith('uuid');
            expect(entity.name).toEqual('bar');

            uuid.mockReset();
        });

        it('Can create a base entity with a new UUID and custom namespace.', () => { 
            const data = {name: 'bar'};

            const entity = baseEntityFactory(data, 'ns');

            expect(uuid).toHaveBeenCalledWith('ns');
            expect(entity.name).toEqual('bar');

            uuid.mockReset();
        });
    });

});