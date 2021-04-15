import uuid from 'Libs/uuid';

export default {
    description: 'Adds ID to memories and events.',
    requiredSignature: 1,
    migrate(data) {
        data.memories.forEach((memory) => {
            if (!memory.id) {
                memory.id = uuid('memory');
            }

            memory.events.forEach((event, idx, memories) => {
                if (typeof event === 'string') {
                    event = {
                        description: event,
                        id: uuid('event')
                    };

                    memories[idx] = event;
                }
            });
        });

        return data;
    }
};