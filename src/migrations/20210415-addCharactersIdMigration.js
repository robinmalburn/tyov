import uuid from 'Libs/uuid';

export default {
    description: 'Adds ID to characters.',
    requiredSignature: 1,
    migrate(data) {
        data.characters.forEach((character) => {
            if (!character.id) {
                character.id = uuid('character');
            }
        });

        return data;
    }
};