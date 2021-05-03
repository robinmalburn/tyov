import uuid from 'Libs/uuid';

export const baseEntityFactory = (data, ns='uuid') => {
    const entity = deepCopy(data);

    if (!data.id) {
        entity.id = uuid(ns);
    }

    return entity;
}

export const shallowCopy = (data) => {

    if (data === null) {
        return data;
    }

    if (Array.isArray(data)) {
        return Array.from(data);
    }

    if (typeof data === 'object') {
        return {...data};
    }

    return data;
}

export const deepCopy = (data) => {
    if (data === null) {
        return data;
    }

    try {
        return JSON.parse(JSON.stringify(data));
    } catch (err) {
        console.err(`Error with deep data copy, falling back to shallow copy.  Error: ${err}`);

        return shallowCopy(data);
    }
}

export const hasId = (data, value, key='id') => {
    return data.some(item => {
        return item[key] === value;
    });
};

export const findById = (data, value, key='id') => {
    let result = {
        entity: null,
        idx: null,
    };

    data.some((item, idx) => {
        if (item[key] === value) {
            result = {entity: item, idx};
            return true;
        }
    });

    return result;
};