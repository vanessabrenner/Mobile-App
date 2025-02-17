export interface MyPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface ItemProps {
  _id?: string;
  title: string;
  author: string;
  pages: number; 
  releaseDate: Date,
  inStock: boolean;
  photos?: MyPhoto[];
  location?: Location;
}
