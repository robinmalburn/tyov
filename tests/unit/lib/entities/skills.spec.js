import { baseEntityFactory } from 'Lib/entities';
import skills from 'Lib/entities/skills';

jest.mock('Lib/entities');

describe('lib/entities/skills.js', () => {
    it('Can create a default skill entity.', () => { 
        const skill = skills();

        expect(skill.name).toEqual('');
        expect(skill.checked).toEqual(false);
        expect(baseEntityFactory).toHaveBeenCalledWith({}, 'skill');
    });
    
    it('Can create a skill entity with injected data.', () => { 
        baseEntityFactory.mockImplementation((values) => values);

        const data = {
            name: 'foo',
            checked: true
        };

        const skill = skills(data);

        expect(skill.name).toEqual(data.name);
        expect(skill.checked).toEqual(data.checked);
        expect(baseEntityFactory).toHaveBeenCalledWith(data, 'skill');
    });
});