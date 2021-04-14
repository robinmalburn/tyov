/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
export const supportsLocalStorage = () => {
    var storage = window.localStorage;
    try {
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

const set = (key, value) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }

    window.localStorage.setItem(key, value);
};

const get = (key) => {
    let value = window.localStorage.getItem(key);

    if (value === null) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export default {
    set,
    get,
    supported: supportsLocalStorage
};