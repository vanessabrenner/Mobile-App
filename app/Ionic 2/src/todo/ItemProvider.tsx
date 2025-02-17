import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import {
  IonToast,
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemProps } from './ItemProps';
import { createItem, getItems, newWebSocket, updateItem } from './itemApi';
import { AuthContext } from '../auth';
import { usePreferences } from '../network/usePreferences'; // Assuming your hook is in this file
import { useNetwork } from '../network/useNetwork'; // Importing the useNetwork hook

const log = getLogger('ItemProvider');

type SaveItemFn = (item: ItemProps) => Promise<any>;

export interface ItemsState {
  items?: ItemProps[];
  fetching: boolean;
  fetchingError?: Error | null;
  saving: boolean;
  savingError?: Error | null;
  saveItem?: SaveItemFn;
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const SAVE_LOCAL_ITEM_SUCCEEDED = 'SAVE_LOCAL_ITEM_SUCCEEDED';
const CLEAR_ALL_ITEMS = 'CLEAR_ALL_ITEMS';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, items: payload.items, fetching: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED: {
        const items = [...(state.items || [])];
        const item = payload.item;

        if (!item._id) {
          log('SAVE_ITEM_SUCCEEDED - received item without _id:', item);
          return { ...state, saving: false }; // Ignore items without _id
        }

        const index = items.findIndex(it => it._id === item._id);
        if (index === -1) {
          items.push(item);
        } else {
          items[index] = item;
        }

        return { ...state, items, saving: false };
      }
      case SAVE_ITEM_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      case SAVE_LOCAL_ITEM_SUCCEEDED: {
        const items = [...(state.items || [])];
        const item = payload.item;

        const index = items.findIndex(it => it._id === item._id);
        if (index === -1) {          
          items.push(item); 
        } else {
          items[index] = item;
        }

        return { ...state, items, saving: false };
      }
      case CLEAR_ALL_ITEMS:
        return { ...state, items: [] }; 
      default:
        return state;
    }
  };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const { token } = useContext(AuthContext);
  const { saveItem: saveItemToPreferences, loadAllKeys, loadItem, clearStorage } = usePreferences();
  const { networkStatus } = useNetwork(); // Get network status from the hook
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError } = state;

  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token, networkStatus.connected]);

  useEffect(() => {
    if (networkStatus.connected) {
      syncLocalItemsWithServer(); // Sync items when the app goes online
      getItemsEffect();
    }
  }, [networkStatus.connected]); // Trigger when network status changes

  const value = { items, fetching, fetchingError, saving, savingError, saveItem };

  log('returns');
  return (
    <ItemContext.Provider value={value}>
      {children}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Item-ul a fost salvat local și se va sincroniza când aplicația revine online."
        duration={3000} // Mesajul dispare după 3 secunde
      />
    </ItemContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    if (token) {
      fetchItems();
    }
    return () => {
      canceled = true;
    };

    async function fetchItems() {
      try {
        dispatch({ type: CLEAR_ALL_ITEMS });
        log('fetchItems started');
        dispatch({ type: FETCH_ITEMS_STARTED });  
        const items = await getItems(token);
        log('fetchItems succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        log('fetchItems failed', error);
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
      }
    }
  }

  async function saveItemCallback(item: ItemProps) {
    try {
      log('saveItem started');
      dispatch({ type: SAVE_ITEM_STARTED });

      if (networkStatus.connected) {
        // If online, save to server
        const savedItem = await (item._id ? updateItem(token, item) : createItem(token, item));
        log("saveItemCallback - item to be saved", savedItem);
        log('saveItem succeeded');
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
      } else {
        // If offline, save locally
        await saveItemToPreferences(item);
        log('Item saved locally as offline');
        dispatch({ type: SAVE_LOCAL_ITEM_SUCCEEDED, payload: { item } });

        showOfflineNotification();
      }
    } catch (error) {
      log('saveItem failed');
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function showOfflineNotification() {
    setShowToast(true);
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }

        const { type, payload: item } = message;
        log(`ws message, item ${type}`);
        if (type === 'created' || type === 'updated') {
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
        }
      });
    }
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    };
  }

  async function syncLocalItemsWithServer() {

    const keys = await loadAllKeys(); // Get all local keys
    for (const key of keys) {
      const item = await loadItem(key); // Load each item
      if (item) {
        await saveItemCallback(item); // Sync the item with the server
      }
    }
    clearStorage();
  }
};
