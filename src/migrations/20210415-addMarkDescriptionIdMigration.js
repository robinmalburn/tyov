import uuid from 'Libs/uuid';

export default {
    description: 'Adds ID & Description to marks.',
    requiredSignature: 1,
    migrate(data) {
        data.marks.forEach((mark, idx, marks) => {
            if (typeof mark === 'string') {
                marks[idx] = {
                    id: uuid('mark'),
                    description: mark,
                }
            }
        });

        return data;
    }
};