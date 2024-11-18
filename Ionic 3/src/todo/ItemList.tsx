import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonItem,
  IonLabel,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonButton,
  IonToolbar,
  IonSearchbar,
  IonCheckbox,
  IonText,
} from '@ionic/react';
import { add, checkmarkCircle, closeCircle, logOut } from 'ionicons/icons';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { useNetwork } from '../network/useNetwork';
import { AuthContext } from '../auth/AuthProvider';

const log = getLogger('ItemList');

const INITIAL_ITEMS_COUNT = 5;
const LOAD_MORE_COUNT = 5;

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { networkStatus } = useNetwork();
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  const [inStockFilter, setInStockFilter] = useState<boolean | undefined>(undefined); // Filtrul pentru inStock
  const [visibleItemsCount, setVisibleItemsCount] = useState(INITIAL_ITEMS_COUNT);

  // Filtrarea itemelor în funcție de textul căutat și statusul inStock
  const filteredItems = items?.filter(
    (item) =>
      (item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.author.toLowerCase().includes(searchText.toLowerCase())) &&
      (inStockFilter === undefined || item.inStock === inStockFilter) // Filtru pentru inStock
  );

  const visibleItems = filteredItems?.slice(0, visibleItemsCount);

  const handleScroll = (event: CustomEvent) => {
    const target = event.target as HTMLElement;

    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (visibleItemsCount < (filteredItems?.length || 0)) {
        log('Loading more items...');
        setVisibleItemsCount((prevCount) => prevCount + LOAD_MORE_COUNT);
      }
    }
  };

  useEffect(() => {
    setVisibleItemsCount(INITIAL_ITEMS_COUNT); // Resetăm numărul de iteme vizibile la fiecare căutare
  }, [searchText, inStockFilter]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: networkStatus.connected ? 'green' : 'red',
                border: '1px solid white',
                marginLeft: '5px',
              }}
            />
            <IonTitle>📚 My Book Collection</IonTitle>
          </div>
          <IonButton slot="end" color="light" onClick={() => logout && logout()}>
            <IonIcon icon={logOut} slot="start" />
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" onIonScroll={handleScroll} scrollEvents={true}>
        <IonLoading isOpen={fetching} message="Fetching books..." />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IonSearchbar
            value={searchText}
            debounce={1000}
            onIonInput={(e) => setSearchText(e.detail.value!)} 
            placeholder="Search books by title or author"
            style={{ flex: 1, marginRight: '10px' }} // Setează lățimea pentru searchbar
          />
          <IonItem lines="none" style={{ margin: 0 }}>
            <IonLabel style={{ marginRight: '15px' }}>In stock</IonLabel>
            <IonCheckbox
              checked={inStockFilter === true}
              onIonChange={(e) => setInStockFilter(e.detail.checked ? true : undefined)} // Filtrare pe inStock
            />
          </IonItem>
        </div>

        {fetchingError && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            {fetchingError.message || 'Failed to fetch books'}
          </div>
        )}

        {visibleItems && visibleItems.length > 0 ? (
          <IonList>
            {visibleItems.map(({ _id, title, author, pages, releaseDate, inStock }) => {
              const displayId = _id || `temp-id-${new Date().getTime()}`;
              return (
                <IonItem key={displayId} button onClick={() => history.push(`/item/${_id}`)}>
                  <IonLabel>
                    <h2>{title}</h2>
                    <p>Author: {author}</p>
                    <p>Pages: {pages}</p>
                    <p>Release Date: {new Date(releaseDate).toLocaleDateString()}</p>
                    <p>Status: {inStock ? 'In Stock' : 'Out of Stock'}</p>
                  </IonLabel>
                  <IonIcon
                    slot="end"
                    icon={inStock ? checkmarkCircle : closeCircle}
                    color={inStock ? 'success' : 'danger'}
                  />
                </IonItem>
              );
            })}
          </IonList>
        ) : (
          !fetching && (
            <div style={{ textAlign: 'center', color: 'gray', marginTop: '2rem' }}>
              {searchText ? 'No books match your search.' : 'No books available. Click the "+" button to add a new book.'}
            </div>
          )
        )}

        {visibleItemsCount >= (filteredItems?.length || 0) && (
          <div style={{ textAlign: 'center', color: 'gray', marginTop: '2rem' }}>
            All books loaded.
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')} disabled={fetching}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
