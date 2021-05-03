import { baseEntityFactory } from 'Libs/entities';

const MEMORY_NS = 'memory';

const EVENT_NS = 'event';

export const memoryEntityFactory = (data={}) => {
    return {
        description: '',
        forgotten: false,
        diary: '',
        ...baseEntityFactory(data, MEMORY_NS),
    }
}

export const eventEntityFactory = (data={}) => {
    return {
        description: '',
        memory: '',
        ...baseEntityFactory(data, EVENT_NS),
    }
}