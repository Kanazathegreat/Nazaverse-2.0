export const Storage = {
    get(key) {
        try {
            return localStorage.getItem('nz_' + key);
        }
        catch {
            return null;
        }
    },
    set(key, val) {
        try {
            localStorage.setItem('nz_' + key, val);
        }
        catch { }
    },
    remove(key) {
        try {
            localStorage.removeItem('nz_' + key);
        }
        catch { }
    }
};
//# sourceMappingURL=storage.js.map