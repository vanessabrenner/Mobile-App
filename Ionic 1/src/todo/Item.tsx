import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { getLogger } from '../core';
import { BookProps } from './ItemProps'; // Importăm interfața BookProps

const log = getLogger('Book');

interface BookPropsExt extends BookProps {
  onEdit: (id?: string) => void; // Funcția pentru editare
}

const Book: React.FC<BookPropsExt> = ({ id, title, author, pages, inStock, onEdit }) => {
  // log(`Rendering book: ${title}, by ${author}`); // Log pentru a verifica renderizarea

  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>
        <h2>{title}</h2>
        <p>Author: {author}</p>
        <p>Pages: {pages}</p>
        <p>Status: {inStock ? 'In Stock' : 'Out of Stock'}</p>
      </IonLabel>
    </IonItem>
  );
};

export default memo(Book); // Exportăm componenta Book
