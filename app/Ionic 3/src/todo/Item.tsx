import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, title, author, pages, releaseDate, inStock, onEdit }) => {
  return (    
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>
        <h2>{title}</h2>
        <p>Author: {author}</p>
        <p>Pages: {pages}</p>
        <p>Status: {inStock ? 'In Stock' : 'Out of Stock'}</p>
        <p>Release Date: {releaseDate.toLocaleDateString()}</p>
      </IonLabel>
    </IonItem>
  );
};

export default Item;
