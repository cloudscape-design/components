// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { render } from '@testing-library/react';
import {
  FocusableChangeHandler,
  FocusableDefinition,
  SingleTabStopNavigationContext,
} from '../../../../lib/components/internal/context/single-tab-stop-navigation-context';

interface ProviderRef {
  setCurrentTarget(focusTarget: null | Element, suppressed?: (null | Element)[]): void;
}

const FakeSingleTabStopNavigationProvider = forwardRef(
  (
    { children, navigationActive }: { children: React.ReactNode; navigationActive: boolean },
    ref: React.Ref<ProviderRef>
  ) => {
    const focusablesRef = useRef(new Set<FocusableDefinition>());
    const focusHandlersRef = useRef(new Map<FocusableDefinition, FocusableChangeHandler>());
    const registerFocusable = useCallback((focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) => {
      focusablesRef.current.add(focusable);
      focusHandlersRef.current.set(focusable, changeHandler);
      return () => {
        focusablesRef.current.delete(focusable);
        focusHandlersRef.current.delete(focusable);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      setCurrentTarget: (focusTarget: null | Element, suppressed: (null | Element)[] = []) => {
        focusablesRef.current.forEach(focusable => {
          const element = focusable.current;
          const handler = focusHandlersRef.current.get(focusable)!;
          handler(focusTarget, element ? suppressed.includes(element) : false);
        });
      },
    }));

    return (
      <SingleTabStopNavigationContext.Provider value={{ registerFocusable, navigationActive }}>
        {children}
      </SingleTabStopNavigationContext.Provider>
    );
  }
);

export function renderWithSingleTabStopNavigation(
  ui: React.ReactNode,
  { navigationActive = true }: { navigationActive?: boolean } = {}
) {
  const providerRef = createRef<ProviderRef>();
  const { container, rerender } = render(
    <FakeSingleTabStopNavigationProvider ref={providerRef} navigationActive={navigationActive}>
      {ui}
    </FakeSingleTabStopNavigationProvider>
  );
  return {
    container,
    rerender,
    setCurrentTarget: (focusTarget: null | Element, suppressed: (null | Element)[] = []) => {
      if (!providerRef.current) {
        throw new Error('Provider is not ready');
      }
      providerRef.current.setCurrentTarget(focusTarget, suppressed);
    },
  };
}
