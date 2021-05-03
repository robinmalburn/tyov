import { baseEntityFactory } from 'Libs/entities';

const NS = 'mark';

export default (data={}) => {
    return {
        description: '',
        ...baseEntityFactory(data, NS),
    }
}