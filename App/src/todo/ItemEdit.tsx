import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  IonCheckbox, // Importăm IonCheckbox
  IonItem
} from '@ionic/react';
import { getLogger } from '../core';
import { BookContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { BookProps } from './ItemProps'; // Importăm interfața BookProps

const log = getLogger('BookEdit');

interface BookEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const BookEdit: React.FC<BookEditProps> = ({ history, match }) => {
  const { books, saving, savingError, saveBook } = useContext(BookContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState<number | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean>(true); // Starea pentru inStock
  const [book, setBook] = useState<BookProps | undefined>(undefined); // Asigurăm că book este inițializat ca undefined

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const foundBook = books?.find(it => it.id === routeId);
    setBook(foundBook);
    if (foundBook) {
      setTitle(foundBook.title);
      setAuthor(foundBook.author);
      setPages(foundBook.pages);
      setInStock(foundBook.inStock); // Setăm starea pentru inStock
    }
  }, [match.params.id, books]);

  const handleSave = useCallback(() => {
    // Creăm un obiect BookProps pentru salvare
    const editedBook: BookProps = {
      id: book?.id, // Menținem ID-ul cărții existente
      title,
      author,
      pages: pages ?? 0, // Setăm pages la 0 dacă este undefined
      inStock // Folosim valoarea de inStock
    };
  
    saveBook && saveBook(editedBook).then(() => history.goBack());
  }, [book, saveBook, title, author, pages, inStock, history]);
  
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
          value={title}
          onIonChange={e => setTitle(e.detail.value || '')}
        />
        <IonInput
          placeholder="Author"
          value={author}
          onIonChange={e => setAuthor(e.detail.value || '')}
        />
        <IonInput
          placeholder="Pages"
          type="number"
          value={pages !== undefined ? String(pages) : ''} // Asigurăm că value este un string
          onIonChange={e => setPages(parseInt(e.detail.value!, 10) || undefined)}
        />
        <IonItem>
          <IonCheckbox
            checked={inStock} // Setăm checkbox-ul
            onIonChange={e => setInStock(e.detail.checked)} // Actualizăm starea pentru inStock
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

export default BookEdit; // Exportăm componenta BookEdit
