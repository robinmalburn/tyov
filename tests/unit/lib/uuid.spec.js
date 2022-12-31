import uuid from 'Libs/uuid';

describe('lib/uuid.js', () => {
    it('Generates uuids (with the default namespace).', () => { 
        const first = uuid();
        const second = uuid();
        const pattern = /uuid-\d+-\d{13,}/;

        expect(first).toMatch(pattern);
        expect(second).toMatch(pattern);
        expect(first).not.toEqual(second);
    });

    it ('Generates a uuid in a given namesapce.', () => { 
        const bare = uuid();
        const namespaced = uuid('foo');
        const barePattern = /uuid-\d+-\d{13,}/;
        const nsPattern = /foo-\d+-\d{13,}/;

        expect(bare).toMatch(barePattern);
        expect(namespaced).toMatch(nsPattern);
    })
});