import { useEffect, useState } from 'react';
import { Club } from './clubContext';

export function useLocalStorageSync(key: string, initialValue: Club[]) {
  const [storedValue, setStoredValue] = useState<Club[]>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = (value: Club[] | ((val: Club[]) => Club[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`Saved ${key} to localStorage:`, valueToStore);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const forceReload = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
        console.log(`Reloaded ${key} from localStorage:`, JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reloading ${key} from localStorage:`, error);
    }
  };

  return [storedValue, setValue, forceReload] as const;
}
