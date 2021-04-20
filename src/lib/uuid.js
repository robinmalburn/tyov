// eslint-disable-next-line no-unused-vars
var counter = Date.now();

export default (ns='uuid') => {
    ++counter;

    return `${ns}-${counter}-${Date.now()}`;
};

export const hasId = (data, value, key='id') => {
    return data.some(item => {
        return item[key] === value;
    });
};

export const findById = (data, value, key='id') => {
    // eslint-disable-next-line no-unused-vars
    let result = null;
    data.some((item, idx) => {
        if (item[key] === value) {
            result = {item, idx};
            return true;
        }
    });
    return result;
};