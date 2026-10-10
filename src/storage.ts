export const Storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem('nz_' + key);
    } catch { return null; }
  },
  set(key: string, val: string) {
    try {
      localStorage.setItem('nz_' + key, val);
    } catch {}
  },
  remove(key: string) {
    try {
      localStorage.removeItem('nz_' + key);
    } catch {}
  }
};

