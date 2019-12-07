/**
 * Utils to access the browser local storage.
 */
export class LocalStorage {
    /**
     * Store value in the local storage.
     *
     * @param key Ket where to store data.
     * @param value Data to be stored in the storage.
     */
    static set(key, value) {
        if (typeof value === 'object') {
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            window.localStorage.setItem(key, value);
        }
    }

    /**
     * Get value from the local storage.
     *
     * @param key Key to fetch from storage.
     * @return Value obtained from the storage.
     */
    static get(key) {
        var value = window.localStorage.getItem(key);

        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Check if a key exists in the local storage.
     *
     * @param key Key to check.
     * @return True if the key exists false otherwise.
     */
    static exists(key) {
        return window.localStorage.getItem(key) !== null;
    }

    /**
     * Delete a key from the local storage.
     *
     * @param key Key to remove from storage.
     */
    static delete(key) {
        return window.localStorage.removeItem(key);
    }
}

