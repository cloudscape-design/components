// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useLayoutEffect, useCallback, useRef, ReactNode } from 'react';

interface StickyColumnsContextValue {
  registerChildCallback: (callback: (entry: any) => void) => void;
  unregisterChildCallback: (callback: (entry: any) => void) => void;
}

const StickyColumnsContext = createContext<StickyColumnsContextValue | null>(null);

export const useStickyColumnsContext = () => {
  const context = useContext(StickyColumnsContext);
  if (!context) {
    return { registerChildCallback: () => {}, unregisterChildCallback: () => {} };
  }
  const { registerChildCallback, unregisterChildCallback } = context as StickyColumnsContextValue;
  return { registerChildCallback, unregisterChildCallback };
};

interface StickyColumnsContextProviderProps {
  children: ReactNode;
  wrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  shouldDisableStickyColumns: boolean;
}
interface StickyColumnsContextProvider {
  (props: StickyColumnsContextProviderProps): JSX.Element;
}

export const StickyColumnsContextProvider: StickyColumnsContextProvider = ({
  children,
  wrapperRef,
  tableRef,
  shouldDisableStickyColumns,
}) => {
  const childCallbacks = useRef<Set<(entry: any) => void>>(new Set());

  const createScrollHandler = useCallback(() => {
    const scrollHandler = () => {
      const wrapper = wrapperRef.current;
      const table = tableRef.current;
      if (wrapper && table) {
        const tableLeftPadding = Number(getComputedStyle(table).paddingLeft.slice(0, -2));
        const tableRightPadding = Number(getComputedStyle(table).paddingRight.slice(0, -2));
        const right = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - tableRightPadding;
        const left = wrapper.scrollLeft > tableLeftPadding;

        // Call all registered child callbacks
        childCallbacks.current.forEach(callback => callback({ left, right }));
      }
    };

    return scrollHandler;
  }, [tableRef, wrapperRef]);

  useLayoutEffect(() => {
    const scrollHandler = createScrollHandler();
    const wrapper = wrapperRef.current;
    const currentChildCallbacks = childCallbacks.current;
    if (!shouldDisableStickyColumns) {
      wrapper && wrapper.addEventListener('scroll', scrollHandler);
      window.addEventListener('resize', scrollHandler);
    } else if (shouldDisableStickyColumns) {
      wrapper && wrapper.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);
    }

    return () => {
      wrapper && wrapper.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);

      currentChildCallbacks.clear();
    };
  }, [createScrollHandler, wrapperRef, shouldDisableStickyColumns]);

  const registerChildCallback = (callback: (entry: any) => void) => {
    childCallbacks.current.add(callback);
  };

  const unregisterChildCallback = (callback: (entry: any) => void) => {
    childCallbacks.current.delete(callback);
  };

  return (
    <StickyColumnsContext.Provider value={{ registerChildCallback, unregisterChildCallback }}>
      {children}
    </StickyColumnsContext.Provider>
  );
};
