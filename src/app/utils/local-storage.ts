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
    public static set(key: string, value: any): void {
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
    public static get(key: string): any {
        let value = window.localStorage.getItem(key);

        if (value === 'null' || value === 'undefined' || value === undefined) {
            return null;
        }

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
    public static exists(key: string): boolean {
        return window.localStorage.getItem(key) !== null;
    }

    /**
     * Delete a key from the local storage.
     *
     * @param key Key to remove from storage.
     */
    public static delete(key: string): any {
        return window.localStorage.removeItem(key);
    }
}

