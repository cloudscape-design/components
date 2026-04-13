// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const iconItems = [
  { type: 'icon-button' as const, id: 'home', text: 'Home', iconName: 'view-full' as const },
  { type: 'icon-button' as const, id: 'search', text: 'Search', iconName: 'search' as const },
];

const start = <ButtonGroup variant="icon" ariaLabel="Tools" items={iconItems} onItemClick={() => {}} />;
const end = (
  <ButtonGroup
    variant="icon"
    ariaLabel="Account"
    items={[{ type: 'icon-button' as const, id: 'settings', text: 'Settings', iconName: 'settings' as const }]}
    onItemClick={() => {}}
  />
);

const permutations = createPermutations<NavigationBarProps>([
  {
    variant: ['primary', 'secondary'],
    placement: ['inline-start', 'inline-end'],
    startContent: [start],
    endContent: [end],
    ariaLabel: ['Tool rail'],
  },
  // Start only
  {
    placement: ['inline-start'],
    startContent: [start],
    ariaLabel: ['Tool rail'],
  },
  // End only
  {
    placement: ['inline-start'],
    endContent: [end],
    ariaLabel: ['Tool rail'],
  },
]);

export default function NavigationBarVerticalPermutations() {
  return (
    <article>
      <h1>NavigationBar vertical permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ display: 'inline-flex', height: 300, marginInlineEnd: 16, marginBlockEnd: 16 }}>
              <NavigationBar {...permutation} />
              <div style={{ padding: 8, fontSize: 12 }}>
                {permutation.variant ?? 'primary'} / {permutation.placement}
              </div>
            </div>
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
