// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import Tabs, { TabsProps } from '~components/tabs';
import SpaceBetween from '~components/space-between';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { colorBackgroundLayoutMain } from '~design-tokens';

const permutations = createPermutations<TabsProps>([
  {
    activeTabId: ['first', 'fourth', 'tenth'],
    tabs: [
      [
        {
          label:
            'This tab has a long header with several words in it so that I can test how the text wraps - with href',
          id: 'first',
          href: '/first',
        },
        {
          label:
            'This tab has a long header with several words in it so that I can test how the text wraps - without href',
          id: 'second',
        },
        { label: 'Third tab', id: 'third' },
        { label: 'Fourth tab', id: 'fourth', href: '/fourth' },
        { label: 'Fifth tab', id: 'fifth', href: '/fifth' },
        { label: 'Sixth tab', id: 'sixth' },
        { label: 'Seventh tab', id: 'seventh' },
        { label: 'Eighth tab', id: 'eighth' },
        {
          label: 'ThistabhasalongheaderwithseveralwordswithoutspacesinitsothatIcantesthowthetextwrapswithhref',
          id: 'ninth',
          href: '/ninth',
        },
        {
          label: 'ThistabhasalongheaderwithseveralwordswithoutspacesinitsothatIcantesthowthetextwrapswithouthref',
          id: 'tenth',
        },
      ],
    ],
  },
]);

export default function ResponsiveTabsPermutations() {
  return (
    <>
      <h1>Tabs permutations - small container</h1>
      <div style={{ maxInlineSize: 700 }}>
        <ScreenshotArea>
          <SpaceBetween size="xs">
            <PermutationsView
              permutations={permutations}
              render={permutation => (
                <Tabs
                  {...permutation}
                  i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                />
              )}
            />
            <div style={{ backgroundColor: colorBackgroundLayoutMain }}>
              <PermutationsView
                permutations={permutations}
                render={permutation => (
                  <Tabs
                    {...permutation}
                    i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                  />
                )}
              />
            </div>
            <PermutationsView
              permutations={permutations}
              render={permutation => (
                <Tabs
                  {...permutation}
                  variant="container"
                  i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                />
              )}
            />
          </SpaceBetween>
        </ScreenshotArea>
      </div>
    </>
  );
}
