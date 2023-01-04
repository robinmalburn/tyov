import { baseEntityFactory } from 'Lib/entities';
import marks from 'Lib/entities/marks';

jest.mock('Lib/entities');

describe('lib/entities/marks.js', () => {
    it('Can create a default mark entity.', () => { 
        const mark = marks();

        expect(mark.description).toEqual('');
        expect(baseEntityFactory).toHaveBeenCalledWith({}, 'mark');
    });
    
    it('Can create a mark entity with injected data.', () => { 
        baseEntityFactory.mockImplementation((values) => values);

        const data = {
            description: 'foo',
        };

        const mark = marks(data);

        expect(mark.description).toEqual(data.description);
        expect(baseEntityFactory).toHaveBeenCalledWith(data, 'mark');
    });
});