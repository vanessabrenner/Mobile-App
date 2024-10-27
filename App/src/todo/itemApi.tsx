import axios from 'axios';
import { getLogger } from '../core';
import { BookProps } from './ItemProps'; // Importăm noua interfață

const log = getLogger('bookApi'); // Actualizăm numele pentru a reflecta schimbarea

const baseUrl = 'http://localhost:3000';
const bookUrl = `${baseUrl}/book`; // Endpoint-ul pentru cărți
const wsBaseUrl = baseUrl.replace(/^http(s)?:\/\//, '');

interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch(err => {
      log(`${fnName} - failed`);
      return Promise.reject(err);
    });
}

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getBooks: () => Promise<BookProps[]> = () => {
  return withLogs(axios.get(bookUrl, config), 'getBooks'); // Schimbăm endpoint-ul și numele funcției
}

export const createBook: (book: BookProps) => Promise<BookProps> = book => {
  return withLogs(axios.post(bookUrl, book, config), 'createBook'); // Schimbăm endpoint-ul și numele funcției
}

export const updateBook: (book: BookProps) => Promise<BookProps> = book => {
  return withLogs(axios.put(`${bookUrl}/${book.id}`, book, config), 'updateBook'); // Schimbăm endpoint-ul și numele funcției
}

interface MessageData {
  event: string;
  payload: {
    book: BookProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${wsBaseUrl}`);
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror');
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}