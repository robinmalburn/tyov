import uuid from 'Libs/uuid';

export default {
    description: 'Adds ID to prompts and removes name.',
    requiredSignature: 1,
    migrate(data) {
        data.prompts.forEach((prompt) => {
            if (!prompt.id) {
                prompt.id = uuid('prompt');
            }

            if (prompt.name) {
                delete prompt.name;

                console.log(prompt);
            }
        });

        return data;
    }
};