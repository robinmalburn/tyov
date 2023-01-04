import { baseEntityFactory } from 'Lib/entities';
import prompts from 'Lib/entities/prompts';

jest.mock('Lib/entities');

describe('lib/entities/prompts.js', () => {
    it('Can create a default prompt entity.', () => { 
        const prompt = prompts();

        expect(prompt.page).toEqual(1);
        expect(prompt.count).toEqual(0);
        expect(baseEntityFactory).toHaveBeenCalledWith({}, 'prompt');
    });
    
    it('Can create a prompt entity with injected data.', () => { 
        baseEntityFactory.mockImplementation((values) => values);

        const data = {
            page: 10,
            count: 2,
        };

        const prompt = prompts(data);

        expect(prompt.page).toEqual(data.page);
        expect(prompt.count).toEqual(data.count);
        expect(baseEntityFactory).toHaveBeenCalledWith(data, 'prompt');
    });
});