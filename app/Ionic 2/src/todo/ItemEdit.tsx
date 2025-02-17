import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonCheckbox,
  IonItem,
  IonDatetime
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState<number | undefined>(undefined);
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean>(false);
  const [item, setItem] = useState<ItemProps | undefined>(undefined);

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setTitle(item.title);
      setAuthor(item.author);
      setPages(item.pages);
      setReleaseDate(item.releaseDate);
      setInStock(item.inStock);
    }
  }, [match.params.id, items]);

  const handleSave = () => {
    // Creăm un obiect BookProps pentru salvare
    const editedItem: ItemProps = item
    ? { 
        ...item, 
        title, 
        author, 
        pages: pages ?? 0, // Use 0 as fallback if pages is undefined
        releaseDate: releaseDate ?? new Date(), // Fallback to current date if releaseDate is undefined
        inStock
      }
    : { 
        title, 
        author, 
        pages: pages ?? 0, // Use 0 as fallback
        releaseDate: releaseDate ?? new Date(), // Fallback to current date
        inStock
      };

    saveItem && saveItem(editedItem).then(() => history.goBack());
  }
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Book</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Title"
          onIonChange={e => setTitle(e.detail.value || '')}
        />
        <IonInput
          placeholder="Author"
          onIonChange={e => setAuthor(e.detail.value || '')}
        />
        <IonInput
          placeholder="Pages"
          type="number"
          onIonChange={e => setPages(parseInt(e.detail.value!, 10) || undefined)}
        />
        <IonItem>
        <IonLabel>Release Date</IonLabel>
        <IonDatetime
          presentation="date" // Înlocuiește displayFormat cu presentation
          preferWheel={true} // Opțional, pentru o interfață de tip "wheel"
          onIonChange={e => {
            const value = e.detail.value;
            setReleaseDate(typeof value === 'string' ? new Date(value) : undefined);
          }}
        />
        </IonItem>
        <IonItem>
          <IonCheckbox
            onIonChange={e => setInStock(e.detail.checked)}
          />
          <IonLabel>In Stock</IonLabel>
        </IonItem>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save book'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
