// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface IntersectionObserverContextValue {
  observer?: React.MutableRefObject<IntersectionObserver | null>;
  registerChildCallback?: (callback: (entry: IntersectionObserverEntry) => void) => void;
  unregisterChildCallback?: (callback: (entry: IntersectionObserverEntry) => void) => void;
}

const IntersectionObserverContext = createContext<IntersectionObserverContextValue | null>(null);

export const useIntersectionObserver = () => {
  const context = useContext(IntersectionObserverContext);
  if (!context) {
    // useIntersectionObserver must be used within IntersectionObserverProvider
    return { registerChildCallback: () => {}, unregisterChildCallback: () => {} };
  }
  const { registerChildCallback, unregisterChildCallback } = context as IntersectionObserverContextValue;
  return { registerChildCallback, unregisterChildCallback };
};

interface IntersectionObserverProviderProps {
  children: ReactNode;
  options: IntersectionObserverInit;
  observedElementRef: React.RefObject<Element>;
}

export const IntersectionObserverProvider: React.FC<IntersectionObserverProviderProps> = ({
  children,
  options,
  observedElementRef,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const childCallbacks = useRef<Array<(entry: IntersectionObserverEntry) => void>>([]);

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        childCallbacks.current.forEach(callback => callback(entry));
      });
    }, options);

    if (observedElementRef && observedElementRef.current && observer.current) {
      observer.current.observe(observedElementRef.current);
    }
  }, [options, observedElementRef]);

  useEffect(() => {
    if (observedElementRef && observedElementRef.current && observer.current) {
      observer.current.observe(observedElementRef.current);
      console.log('Observing element: ', observer.current);
    }
  }, [observedElementRef, observer]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const registerChildCallback = (callback: (entry: IntersectionObserverEntry) => void) => {
    childCallbacks.current = [...childCallbacks.current, callback];
  };

  const unregisterChildCallback = (callback: (entry: IntersectionObserverEntry) => void) => {
    childCallbacks.current = childCallbacks.current.filter(cb => cb !== callback);
  };

  return (
    <IntersectionObserverContext.Provider value={{ observer, registerChildCallback, unregisterChildCallback }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
};
