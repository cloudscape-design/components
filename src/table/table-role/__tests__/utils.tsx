// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { render } from '@testing-library/react';
import { GridNavigationContext } from '../../../../lib/components/table/table-role/grid-navigation-context';

function FakeGridNavigationProvider({ target, children }: { target: null | string; children: React.ReactNode }) {
  const [focusTarget, setFocusTarget] = useState<null | Element>(null);
  useEffect(() => {
    if (!target) {
      setFocusTarget(null);
    } else {
      setFocusTarget(document.querySelector(target));
    }
  }, [target]);
  return (
    <GridNavigationContext.Provider value={{ focusTarget, keyboardNavigation: !!focusTarget }}>
      {children}
    </GridNavigationContext.Provider>
  );
}

export function renderWithGridNavigation({ target }: { target: null | string }, ui: React.ReactNode) {
  return render(<FakeGridNavigationProvider target={target}>{ui}</FakeGridNavigationProvider>);
}
