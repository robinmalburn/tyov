import { baseEntityFactory } from 'Libs/entities';

const NS = 'skill';

export default (data={}) => {
    return {
        name: '',
        checked: false,
        ...baseEntityFactory(data, NS),
    }
}