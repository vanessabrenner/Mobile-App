import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Book from './Item';  // Asigură-te că `Item` reprezintă componenta pentru a afișa o carte
import { getLogger } from '../core';
import { BookContext } from './ItemProvider'; // Context pentru cărți

const log = getLogger('BookList');

const BookList: React.FC<RouteComponentProps> = ({ history }) => {
  const { books, fetching, fetchingError } = useContext(BookContext); // Folosim contextul pentru cărți

  log('render');

  return (
    <IonPage> 
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Books</IonTitle>  {/* Titlul secțiunii */}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching books" /> {/* Indică utilizatorului că se încarcă datele */}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch books'}</div>
        )}
        {books && books.length > 0 ? (  // Verificăm dacă există cărți
          <IonList>
            {books.map(({ id, title, author, pages, inStock }) => (  // Afișăm proprietățile corespunzătoare
              <Book
                key={id}
                id={id}
                title={title}
                author={author}
                pages={pages}
                inStock={inStock}  // Include inStock în props
                onEdit={() => history.push(`/book/${id}`)}  // Navigăm la pagina de editare
              />
            ))}
          </IonList>
        ) : (
          !fetching && <div>No books available</div>  // Mesaj când nu sunt cărți
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/book')} disabled={fetching}>
            <IonIcon icon={add} />  {/* Iconița de adăugare a unei cărți */}
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BookList;  // Exportăm componenta
