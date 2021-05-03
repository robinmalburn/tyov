import { baseEntityFactory } from 'Libs/entities';

const NS = 'prompt';

export default (data={}) => {
    return {
        page: 1,
        count: 0,
        ...baseEntityFactory(data, NS),
    }
}