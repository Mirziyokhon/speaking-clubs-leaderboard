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
      
      // Trigger storage event for cross-tab synchronization
      window.dispatchEvent(new Event('storage'));
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

  const exportData = () => {
    try {
      const data = JSON.stringify(storedValue, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `speaking-clubs-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setValue(importedData);
          console.log('Data imported successfully');
          resolve();
        } catch (error) {
          console.error('Error parsing imported data:', error);
          reject(error);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        reject(new Error('Error reading file'));
      };
      reader.readAsText(file);
    });
  };

  return [storedValue, setValue, forceReload, exportData, importData] as const;
}
