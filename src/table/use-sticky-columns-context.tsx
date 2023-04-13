// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useLayoutEffect, useCallback, useRef, ReactNode } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

interface StickyColumnsContextValue {
  subscribe: (callback: (entry: any) => void) => void;
  unsubscribe: (callback: (entry: any) => void) => void;
}

const StickyColumnsContext = createContext<StickyColumnsContextValue | null>(null);

export const useStickyColumnsContext = () => {
  const context = useContext(StickyColumnsContext);
  if (!context) {
    return { subscribe: () => {}, unsubscribe: () => {} };
  }
  const { subscribe, unsubscribe } = context as StickyColumnsContextValue;
  return { subscribe, unsubscribe };
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
  const callbacks = useRef<Set<(entry: any) => void>>(new Set());

  const createScrollHandler = useCallback(() => {
    const scrollHandler = () => {
      const wrapper = wrapperRef.current;
      const table = tableRef.current;
      if (wrapper && table) {
        const tableLeftPadding = Number(getComputedStyle(table).paddingLeft.slice(0, -2));
        const tableRightPadding = Number(getComputedStyle(table).paddingRight.slice(0, -2));
        const right = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - tableRightPadding;
        const left = wrapper.scrollLeft > tableLeftPadding;

        // Call all subscribed callbacks
        unstable_batchedUpdates(() => {
          callbacks.current.forEach(callback => callback({ left, right }));
        });
      }
    };

    return scrollHandler;
  }, [tableRef, wrapperRef]);

  useLayoutEffect(() => {
    const scrollHandler = createScrollHandler();
    const wrapper = wrapperRef.current;
    const currentCallbacks = callbacks.current;
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

      currentCallbacks.clear();
    };
  }, [createScrollHandler, wrapperRef, shouldDisableStickyColumns]);

  const subscribe = (callback: (entry: any) => void) => {
    callbacks.current.add(callback);
  };

  const unsubscribe = (callback: (entry: any) => void) => {
    callbacks.current.delete(callback);
  };

  return <StickyColumnsContext.Provider value={{ subscribe, unsubscribe }}>{children}</StickyColumnsContext.Provider>;
};
