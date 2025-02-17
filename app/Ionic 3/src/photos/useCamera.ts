import { useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { getLogger } from '../core';

const log = getLogger('useCamera');

export function useCamera() {
  const getPhoto = useCallback(async () => {
    try {    
      log('Opening camera...');
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 100,
      });
      log('Photo data:', photo);
      return photo;
    } catch (error) {
      log('Error opening camera:', error);
      throw error;
    }
  }, []);

  return { getPhoto };
}

