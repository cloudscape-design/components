// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { render } from '@testing-library/react';
import { GridNavigationContext } from '../../../../lib/components/table/table-role/grid-navigation-context';

interface FakeGridNavigationProviderRef {
  setCurrentTarget(element: null | Element): void;
}

const FakeGridNavigationProvider = forwardRef(
  ({ children }: { children: React.ReactNode }, ref: React.Ref<FakeGridNavigationProviderRef>) => {
    const [focusTarget, setFocusTarget] = useState<null | Element>(null);

    useImperativeHandle(ref, () => ({ setCurrentTarget: setFocusTarget }));

    return (
      <GridNavigationContext.Provider value={{ focusTarget, keyboardNavigation: !!focusTarget }}>
        {children}
      </GridNavigationContext.Provider>
    );
  }
);

export function renderWithGridNavigation(ui: React.ReactNode) {
  const providerRef = createRef<FakeGridNavigationProviderRef>();
  const { container, rerender } = render(
    <FakeGridNavigationProvider ref={providerRef}>{ui}</FakeGridNavigationProvider>
  );
  return {
    container,
    rerender,
    setCurrentTarget: (element: null | Element) => {
      if (!providerRef.current) {
        throw new Error('Provider is not ready');
      }
      providerRef.current.setCurrentTarget(element);
    },
  };
}
