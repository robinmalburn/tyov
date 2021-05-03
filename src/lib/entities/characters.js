import { baseEntityFactory } from 'Libs/entities';

const NS = 'character';

export default (data={}) => {
    return {
        name: '',
        dead: false,
        immortal: false,
        bio: '',
        ...baseEntityFactory(data, NS),
    }
}