// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  NotificationsSkeleton,
  ToolbarSkeleton,
} from '../../../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/skeleton-parts';

describe('ToolbarSkeleton', () => {
  test('renders with discoveredBreadcrumbs', () => {
    const { container } = render(
      <ToolbarSkeleton
        appLayoutInternals={
          {
            breadcrumbs: null,
            discoveredBreadcrumbs: { items: [] },
          } as any
        }
        toolbarProps={{} as any}
      />
    );
    expect(container).toBeTruthy();
  });
});

describe('NotificationsSkeleton', () => {
  test('renders', () => {
    const { container } = render(<NotificationsSkeleton appLayoutInternals={{} as any}>{null}</NotificationsSkeleton>);
    expect(container).toBeTruthy();
  });
});
