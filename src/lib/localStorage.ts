/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
export const supportsLocalStorage = (): boolean => {
  const storage = window.localStorage;
  try {
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (err) {
    return (
      err instanceof DOMException &&
      // everything except Firefox
      (err.code === 22 ||
        // Firefox
        err.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        err.name === "QuotaExceededError" ||
        // Firefox
        err.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage?.length !== 0
    );
  }
};

const set = (key: string, value: unknown): void => {
  const storedValue = typeof value === "string" ? value : JSON.stringify(value);

  window.localStorage.setItem(key, String(storedValue));
};

const get = (key: string): unknown => {
  const value = window.localStorage.getItem(key);

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export default {
  set,
  get,
  supported: supportsLocalStorage,
};
