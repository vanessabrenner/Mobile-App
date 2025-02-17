import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { ItemProps } from '../todo/ItemProps';
import { getLogger } from '../core';

const log = getLogger('usePreferences');

export const usePreferences = () => {
    useEffect(() => {
      // Această funcție poate fi apelată cu orice obiect de tip ItemProps
    }, []);

    // Functia care salvează un obiect de tip ItemProps
    const saveItem = async (item: ItemProps) => {
      const key = item._id || `temp-id-${new Date().getTime()}`;  // Folosim _id dacă există, altfel generăm un ID temporar
      item._id = key;
      log("S a pus in prefferences item ul si key + numarul de keys duap adaugarea celui dinainte: ", item, key, await loadAllKeys());
      await Preferences.set({
        key,  // Folosim key-ul generat
        value: JSON.stringify(item),  // Salvăm obiectul sub formă de string JSON
      });
      
    };

    // Functia care încarcă un obiect de tip ItemProps din Preferences
    const loadItem = async (_id: string) => {
      const res = await Preferences.get({ key: _id });
      if (res.value) {
        const item = JSON.parse(res.value);  // Deserializăm obiectul
        log('Item loaded:', item);
        return item;
      } else {
        log('Item not found');
        return null;
      }
    };

    // Functia care afișează toate cheile din stocare
    const loadAllKeys = async () => {
      const { keys } = await Preferences.keys();
      log('Keys found:', keys);
      return keys;  // Returnează array-ul cu chei
    };

    // Functia care șterge un obiect din stocare
    const removeItem = async (_id: string) => {
      await Preferences.remove({ key: _id });
      log(`Item with _id ${_id} removed`);
    };

    // Functia care curăță întreaga stocare
    const clearStorage = async () => {
      await Preferences.clear();
      log('All storage cleared');
    };

    return {
      saveItem,
      loadItem,
      loadAllKeys,
      removeItem,
      clearStorage,
    };
};
