import { useCallback, useEffect, useReducer } from 'react';
import { getLogger } from '../core';
import { BookProps } from './ItemProps'; // Adjust the import to the correct path
import { getBooks } from './itemApi'; // Ensure the correct API for books

const log = getLogger('useBooks');

export interface BooksState {
  books?: BookProps[],
  fetching: boolean,
  fetchingError?: Error,
}

export interface BooksProps extends BooksState {
  addBook: () => void, // Rename to addBook
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: BooksState = {
  books: undefined,
  fetching: false,
  fetchingError: undefined,
};

const FETCH_BOOKS_STARTED = 'FETCH_BOOKS_STARTED';
const FETCH_BOOKS_SUCCEEDED = 'FETCH_BOOKS_SUCCEEDED';
const FETCH_BOOKS_FAILED = 'FETCH_BOOKS_FAILED';

const reducer: (state: BooksState, action: ActionProps) => BooksState =
  (state, { type, payload }) => {
    switch(type) {
      case FETCH_BOOKS_STARTED:
        return { ...state, fetching: true, fetchingError: undefined };
      case FETCH_BOOKS_SUCCEEDED:
        return { ...state, books: payload.books, fetching: false };
      case FETCH_BOOKS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      default:
        return state;
    }
  };

export const useBooks: () => BooksProps = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { books, fetching, fetchingError } = state;

  const addBook = useCallback(() => {
    log('addBook - TODO'); // Placeholder for adding a book functionality
  }, []);

  // Fetch books on mount and set up polling
  useEffect(() => {
    let canceled = false;

    const fetchBooks = async () => {
      try {
        log('fetchBooks started');
        dispatch({ type: FETCH_BOOKS_STARTED });
        const books = await getBooks(); // Fetch books from your API
        log('fetchBooks succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_BOOKS_SUCCEEDED, payload: { books } });
        }
      } catch (error) {
        log('fetchBooks failed');
        if (!canceled) {
          dispatch({ type: FETCH_BOOKS_FAILED, payload: { error } });
        }
      }
    };

    fetchBooks();

    const intervalId = setInterval(fetchBooks, 5000); // Poll every 5 seconds

    return () => {
      canceled = true;
      clearInterval(intervalId);
    };
  }, []);

  log(`returns - fetching = ${fetching}, books = ${JSON.stringify(books)}`);
  return {
    books,
    fetching,
    fetchingError,
    addBook,
  };
};
