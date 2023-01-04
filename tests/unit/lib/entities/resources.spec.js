import { baseEntityFactory } from 'Lib/entities';
import { 
    resourceEntityFactory,
    diaryEntityFactory,
} from 'Lib/entities/resources';

jest.mock('Lib/entities');

describe('lib/entities/resources.js', () => {
    describe('Test suite for resource entities.', () => { 
        it('Can create a default resource entity.', () => { 
            const resource = resourceEntityFactory();

            expect(resource.name).toEqual('');
            expect(resource.lost).toEqual(false);
            expect(resource.stationary).toEqual(false);
            expect(baseEntityFactory).toHaveBeenCalledWith({}, 'resource');
        });
        
        it('Can create a resource entity with injected data.', () => { 
            baseEntityFactory.mockImplementation((values) => values);

            const data = {
                name: 'foo',
                lost: true,
                stationary: true
            };

            const resource = resourceEntityFactory(data);

            expect(resource.name).toEqual(data.name);
            expect(resource.lost).toEqual(data.lost);
            expect(resource.stationary).toEqual(data.stationary);
            expect(baseEntityFactory).toHaveBeenCalledWith(data, 'resource');
        });
    });

    describe('Test suite for diary entities.', () => { 
        it('Can create a default diary entity.', () => { 
            const diary = diaryEntityFactory();

            expect(diary.name).toEqual('');
            expect(diary.lost).toEqual(false);
            expect(baseEntityFactory).toHaveBeenCalledWith({}, 'diary');
        });
        
        it('Can create a diary entity with injected data.', () => { 
            baseEntityFactory.mockImplementation((values) => values);

            const data = {
                name: 'foo',
                lost: true,
            };

            const diary = diaryEntityFactory(data);

            expect(diary.name).toEqual(data.name);
            expect(diary.lost).toEqual(data.lost);
            expect(baseEntityFactory).toHaveBeenCalledWith(data, 'diary');
        });
    });
});