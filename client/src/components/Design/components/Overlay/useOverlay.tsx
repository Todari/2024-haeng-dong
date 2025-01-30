import {useContext} from 'react';

import {OverlayContext} from './OverlayProvider';

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }

  const open = (key: string, overlayElement: React.ReactNode) => {
    context.mount(key, overlayElement);
  };

  const close = (key: string) => {
    context.unmount(key);
  };

  return {open, close};
};
