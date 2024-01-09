// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { render } from '@testing-library/react';
import { SingleTabStopNavigationContext } from '../../../../lib/components/internal/context/single-tab-stop-navigation-context';

interface ProviderRef {
  setCurrentTarget(element: null | Element): void;
}

const FakeSingleTabStopNavigationProvider = forwardRef(
  ({ children }: { children: React.ReactNode }, ref: React.Ref<ProviderRef>) => {
    const [focusTarget, setFocusTarget] = useState<null | Element>(null);

    useImperativeHandle(ref, () => ({ setCurrentTarget: setFocusTarget }));

    return (
      <SingleTabStopNavigationContext.Provider value={{ focusTarget, navigationActive: !!focusTarget }}>
        {children}
      </SingleTabStopNavigationContext.Provider>
    );
  }
);

export function renderWithSingleTabStopNavigation(ui: React.ReactNode) {
  const providerRef = createRef<ProviderRef>();
  const { container, rerender } = render(
    <FakeSingleTabStopNavigationProvider ref={providerRef}>{ui}</FakeSingleTabStopNavigationProvider>
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
