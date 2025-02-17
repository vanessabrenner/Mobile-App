import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonDatetime,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
  IonActionSheet,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonFabList,
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

import { camera, close, trash, map } from 'ionicons/icons';
import { MyPhoto, usePhotos } from '../photos/usePhotos';

import MyMap from '../maps/MyMap';
import { useNetwork } from '../network/useNetwork';

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

  const { photos, takePhoto, deletePhoto, setInitialPhotos } = usePhotos(match.params.id || '');
  const [photoToDelete, setPhotoToDelete] = useState<MyPhoto>();

  const { networkStatus } = useNetwork();
  const isOnline = networkStatus.connected;
  const [showMapModal, setShowMapModal] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const openMap = () => {
    setShowMapModal(true); // Deschide modalul
  };

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

      if (item.photos && item.photos.length > 0 && photos.length === 0) {
        setInitialPhotos(item.photos);
        log('Initialized photos with existing product photos');
      }

      if (item.location) {
        setLocation({
          lat: item.location.lat,
          lng: item.location.lng,
        });
      }
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
        releaseDate: releaseDate ?? new Date(),
        photos: photos.map((photo) => ({
          filepath: photo.filepath,
          webviewPath: photo.webviewPath,
        })),
        location: location || undefined,
        inStock
      }
    : { 
        title, 
        author, 
        pages: pages ?? 0, // Use 0 as fallback
        releaseDate: releaseDate ?? new Date(), // Fallback to current date
        photos: photos.map((photo) => ({
          filepath: photo.filepath,
          webviewPath: photo.webviewPath,
        })), 
        location: location || undefined,
        inStock
      };

    log(editedItem);

    saveItem && saveItem(editedItem).then(() => history.goBack());
  }

  const handleMapClick = (e: { latitude: number; longitude: number }) => {
    setLocation({ lat: e.latitude, lng: e.longitude });
    log('Location selected via map:', e.latitude, e.longitude);
  };

  const handleMarkerClick = (e: { markerId: string; latitude: number; longitude: number }) => {
    log('Marker clicked:', e.markerId, e.latitude, e.longitude);
    // Add additional functionalities if needed
  };

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Item</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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

        {/* Modalul care conține harta */}
        <IonModal isOpen={showMapModal} onDidDismiss={() => setShowMapModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Map Location</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMapModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {networkStatus.connected ? (
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    {/* Adăugăm key pentru a forța remontarea hărții la schimbarea locației */}
                    <MyMap
                      key={location ? `${location.lat}-${location.lng}` : 'default'}
                      lat={location ? location.lat : 55.9533} // Default latitude if no location
                      lng={location ? location.lng : -3.1883} // Default longitude if no location
                      onMapClick={handleMapClick}
                      onMarkerClick={() => {}}
                    />
                    {location && (
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <strong>Selected Location:</strong> Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
                      </div>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
            ) : (
              // Mesajul de offline dacă nu este conectat la rețea
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
                <p>Map is not available because you are offline.</p>
              </div>
            )}
          </IonContent>
        </IonModal>
    
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" className="ion-text-center">
              <IonLabel style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Photo Gallery
              </IonLabel>
            </IonCol>

            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <IonCol size="auto" key={index}>
                  <IonImg
                    src={photo.webviewPath}
                    onClick={() => setPhotoToDelete(photo)}
                    style={{
                      width: '100%',
                      maxWidth: '150px', // Dimensiune fixă pentru imagini mai mici
                      height: '150px',   // Menține proporțiile pătrat
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      margin: '10px',
                    }}
                  />
                </IonCol>
              ))
            ) : (
              <IonCol size="auto">
                <p>No photos available</p>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>


        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonRow className="ion-align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
            <IonCol size="auto">
              <IonFabButton onClick={() => setShowMapModal(true)}>
                <IonIcon icon={map} />
              </IonFabButton>
            </IonCol>
            <IonCol size="auto">
              <IonFabButton onClick={() => takePhoto()}>
                <IonIcon icon={camera} />
              </IonFabButton>
            </IonCol>
          </IonRow>
        </IonFab>


        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
        <IonLoading isOpen={saving} />
        {savingError && <div>{savingError.message || 'Failed to save item'}</div>}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
