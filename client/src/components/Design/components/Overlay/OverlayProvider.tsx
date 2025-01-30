import React, {createContext, useCallback, useMemo, useState} from 'react';

interface OverlayContextType {
  overlayMap: Map<string, React.ReactNode>;
  mount: (key: string, overlayElement: React.ReactNode) => void;
  unmount: (key: string) => void;
}

export const OverlayContext = createContext<OverlayContextType | null>(null);

export const OverlayProvider = ({children}: {children: React.ReactNode}) => {
  const [overlayMap, setOverlayMap] = useState<Map<string, React.ReactNode>>(new Map());

  const mount = useCallback((key: string, overlayElement: React.ReactNode) => {
    setOverlayMap(prev => {
      const copy = new Map(prev);
      copy.set(key, overlayElement);
      return copy;
    });
  }, []);

  const unmount = useCallback((key: string) => {
    setOverlayMap(prev => {
      const copy = new Map(prev);
      copy.delete(key);
      return copy;
    });
  }, []);

  const context = useMemo(
    () => ({
      overlayMap,
      mount,
      unmount,
    }),
    [overlayMap, mount, unmount],
  );

  return (
    <OverlayContext.Provider value={context}>
      {children}
      {[...overlayMap.entries()].map(([id, element]) => (
        <React.Fragment key={id}>{element}</React.Fragment>
      ))}
    </OverlayContext.Provider>
  );
};
