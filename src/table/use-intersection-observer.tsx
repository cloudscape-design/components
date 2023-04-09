// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface IntersectionObserverContextValue {
  registerChildCallback?: (id: string, callback: (entry: IntersectionObserverEntry) => void) => void;
  unregisterChildCallback?: (id: string, callback: (entry: IntersectionObserverEntry) => void) => void;
}

const IntersectionObserverContext = createContext<IntersectionObserverContextValue | null>(null);

export const useIntersectionObserver = () => {
  const context = useContext(IntersectionObserverContext);
  if (!context) {
    return { registerChildCallback: () => {}, unregisterChildCallback: () => {} };
  }
  const { registerChildCallback, unregisterChildCallback } = context as IntersectionObserverContextValue;
  return { registerChildCallback, unregisterChildCallback };
};

interface ObservedElement {
  id: string;
  ref: React.RefObject<Element>;
  options: IntersectionObserverInit;
}

interface IntersectionObserverProviderProps {
  children: ReactNode;
  observedElements: ObservedElement[];
  deps?: any[];
}

export const IntersectionObserverProvider: React.FC<IntersectionObserverProviderProps> = ({
  children,
  observedElements,
  deps = [],
}) => {
  const observers = useRef<Map<string, IntersectionObserver>>(new Map());
  const childCallbacks = useRef<Map<string, Set<(entry: IntersectionObserverEntry) => void>>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = React.useState({});

  useEffect(() => {
    // When force update when dependencies change to make subscribers re-register the callbacks
    forceUpdate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  useEffect(() => {
    const createObserver = (id: string, ref: React.RefObject<Element>, options: IntersectionObserverInit) => {
      console.log('CREATING OBSERVER!', id);
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          childCallbacks.current.get(id)?.forEach(callback => callback(entry));
        });
      }, options);

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    };

    observedElements.forEach(({ id, ref, options }) => {
      if (!observers.current.has(id)) {
        console.log('!observers.current.has(id)!');
        const observer = createObserver(id, ref, options);
        observers.current.set(id, observer);
        childCallbacks.current.set(id, new Set());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observedElements, ...deps]);

  useEffect(() => {
    const currentObservers = observers.current;
    const currentChildCallbacks = childCallbacks.current;
    return () => {
      // Disconnect all observers
      currentObservers.forEach(observer => observer.disconnect());

      // Clear registered callbacks
      currentChildCallbacks.clear();

      // Clear observers map
      currentObservers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const registerChildCallback = (id: string, callback: (entry: IntersectionObserverEntry) => void) => {
    const callbacks = childCallbacks.current.get(id);
    if (callbacks) {
      callbacks.add(callback);
    }
  };

  const unregisterChildCallback = (id: string, callback: (entry: IntersectionObserverEntry) => void) => {
    const callbacks = childCallbacks.current.get(id);
    if (callbacks) {
      callbacks.delete(callback);
    }
  };

  return (
    <IntersectionObserverContext.Provider value={{ registerChildCallback, unregisterChildCallback }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
};
