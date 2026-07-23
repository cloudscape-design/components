// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

// Demonstrates arrow-key wrap-around navigation in Tabs:
// - Right arrow on the last (enabled) tab moves focus to the first tab.
// - Left arrow on the first (enabled) tab moves focus to the last tab.
// Disabled tabs are skipped, including when a disabled tab sits at either boundary.

const contentFor = (label: string) => (
  <Box padding="s">Content for {label}. Use Left/Right arrows to move between tabs and observe the wrap-around.</Box>
);

const basicTabs: Array<TabsProps.Tab> = [
  { id: 'first', label: 'First tab', content: contentFor('First tab') },
  { id: 'second', label: 'Second tab', content: contentFor('Second tab') },
  { id: 'third', label: 'Third tab', content: contentFor('Third tab') },
  { id: 'fourth', label: 'Fourth tab', content: contentFor('Fourth tab') },
];

const disabledBoundaryTabs: Array<TabsProps.Tab> = [
  { id: 'first', label: 'First tab (disabled)', disabled: true, content: contentFor('First tab') },
  { id: 'second', label: 'Second tab', content: contentFor('Second tab') },
  { id: 'third', label: 'Third tab', content: contentFor('Third tab') },
  { id: 'fourth', label: 'Fourth tab (disabled)', disabled: true, content: contentFor('Fourth tab') },
];

export default function TabsKeyboardWrapPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="xl">
        <Box variant="h1">Tabs keyboard wrap-around</Box>

        <div>
          <Box variant="h2">Basic wrap</Box>
          <Box color="text-body-secondary" padding={{ bottom: 's' }}>
            Focus a tab, then press Right on the last tab to wrap to the first, or Left on the first tab to wrap to the
            last.
          </Box>
          <Tabs tabs={basicTabs} ariaLabel="Basic wrap tabs" />
        </div>

        <div>
          <Box variant="h2">Wrap with disabled tabs at the boundaries</Box>
          <Box color="text-body-secondary" padding={{ bottom: 's' }}>
            The first and last tabs are disabled. Wrapping skips them: Left from the first enabled tab lands on the last
            enabled tab, and Right from the last enabled tab lands on the first enabled tab.
          </Box>
          <Tabs tabs={disabledBoundaryTabs} ariaLabel="Wrap with disabled boundary tabs" />
        </div>
      </SpaceBetween>
    </Box>
  );
}
