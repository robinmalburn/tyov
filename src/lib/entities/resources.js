import { baseEntityFactory } from 'Libs/entities';

const RESOURCE_NS = 'resource';

const DIARY_NS = 'diary';

export const resourceEntityFactory = (data={}) => {
    return {
        name: '',
        lost: false,
        stationary: false,
        ...baseEntityFactory(data, RESOURCE_NS),
    }
}

export const diaryEntityFactory = (data={}) => {
    return {
        name: '',
        lost: false,
        ...baseEntityFactory(data, DIARY_NS),
    }
}