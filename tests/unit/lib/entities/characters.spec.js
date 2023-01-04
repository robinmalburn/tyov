import { baseEntityFactory } from 'Libs/entities';
import characters from 'Libs/entities/characters';

jest.mock('Libs/entities');

describe('lib/entities/characters.js', () => {
    it('Can create a default character entity.', () => { 
        const character = characters();

        expect(character.name).toEqual('');
        expect(character.dead).toEqual(false);
        expect(character.immortal).toEqual(false);
        expect(character.bio).toEqual('');
        expect(baseEntityFactory).toHaveBeenCalledWith({}, 'character');
    });
    
    it('Can create a character entity with injected data.', () => { 
        baseEntityFactory.mockImplementation((values) => values);

        const data = {
            name: 'foo',
            bio: 'bar',
            dead: true
        };

        const character = characters(data);

        expect(character.name).toEqual(data.name);
        expect(character.dead).toEqual(data.dead);
        expect(character.immortal).toEqual(false);
        expect(character.bio).toEqual(data.bio);
        expect(baseEntityFactory).toHaveBeenCalledWith(data, 'character');
    });
});