// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const LONG_ITEMS = [
  { text: 'Home', href: '#home' },
  { text: 'Service', href: '#service' },
  { text: 'Region', href: '#region' },
  { text: 'Resource type', href: '#resource-type' },
  { text: 'Resource name', href: '#resource-name' },
];

const SHORT_ITEMS = [
  { text: 'Home', href: '#home' },
  { text: 'Resource', href: '#resource' },
];

export default function BreadcrumbGroupMaxItemsPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <Box padding="xl">
        <SpaceBetween size="xxl">
          <h1>BreadcrumbGroup — maxItems collapse</h1>

          <section>
            <h2>maxItems=3 with 5 items (collapses 2 middle items)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs maxItems=3"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              maxItems={3}
              data-testid="max-items-3"
            />
          </section>

          <section>
            <h2>maxItems=4 with 5 items (collapses 1 middle item)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs maxItems=4"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              maxItems={4}
              data-testid="max-items-4"
            />
          </section>

          <section>
            <h2>maxItems=2 with 5 items (collapses all middle items — uses AllItemsDropdown)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs maxItems=2"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              maxItems={2}
              data-testid="max-items-2"
            />
          </section>

          <section>
            <h2>maxItems=5 with 5 items (no collapse — items fit within cap)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs maxItems=5"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              maxItems={5}
              data-testid="max-items-5-exact"
            />
          </section>

          <section>
            <h2>maxItems=10 with 5 items (no collapse — cap larger than item count)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs maxItems=10"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              maxItems={10}
              data-testid="max-items-10"
            />
          </section>

          <section>
            <h2>maxItems=3 with 2 items (no collapse — fewer items than cap)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs short"
              expandAriaLabel="Show path"
              items={SHORT_ITEMS}
              maxItems={3}
              data-testid="max-items-short"
            />
          </section>

          <section>
            <h2>No maxItems (responsive collapse only — default behaviour)</h2>
            <BreadcrumbGroup
              ariaLabel="Breadcrumbs default"
              expandAriaLabel="Show path"
              items={LONG_ITEMS}
              data-testid="max-items-none"
            />
          </section>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
