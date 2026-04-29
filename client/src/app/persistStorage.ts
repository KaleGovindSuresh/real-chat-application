// src/app/persistStorage.ts
// Safe localStorage wrapper for redux-persist

type PersistStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createLocalStorage(): PersistStorage {
  return {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}

function createNoopStorage(): PersistStorage {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

export const localStorageAdapter: PersistStorage =
  typeof window !== "undefined" && window.localStorage
    ? createLocalStorage()
    : createNoopStorage();
