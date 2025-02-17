import { Directory, Filesystem } from '@capacitor/filesystem';
import { useCallback } from 'react';

export function useFilesystem() {
  const readFile = useCallback<(path: string) => Promise<string>>(
    async (path) => {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Data,
      });

      // Verificăm dacă datele sunt un string; dacă nu, tratăm cazul separat (de ex. logăm o eroare).
      if (typeof result.data === 'string') {
        return result.data; // Returnăm stringul
      }

      throw new Error('Unexpected data type: Blob received instead of string');
    },
    []
  );

  const writeFile = useCallback<(path: string, data: string) => Promise<any>>(
    (path, data) =>
      Filesystem.writeFile({
        path,
        data,
        directory: Directory.Data,
      }),
    []
  );

  const deleteFile = useCallback<(path: string) => Promise<void>>(
    (path) =>
      Filesystem.deleteFile({
        path,
        directory: Directory.Data,
      }),
    []
  );

  return {
    readFile,
    writeFile,
    deleteFile,
  };
}
