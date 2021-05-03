// eslint-disable-next-line no-unused-vars
var counter = Date.now();

export default (ns='uuid') => {
    ++counter;

    return `${ns}-${counter}-${Date.now()}`;
};