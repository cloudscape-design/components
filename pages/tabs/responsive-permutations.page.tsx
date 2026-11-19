// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';
import { colorBackgroundLayoutMain } from '~design-tokens';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

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

const tabActionPermutations = createPermutations<TabsProps>([
  {
    activeTabId: ['first', 'fourth', 'sixth'],
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
        { label: 'Third tab', id: 'third', disabled: true },
        {
          label: 'Fourth tab',
          id: 'fourth',
          href: '/fourth',
          dismissible: true,
          dismissLabel: 'Dismiss fourth tab',
        },
        { label: 'Fifth tab', id: 'fifth', dismissible: true, dismissLabel: 'Dismiss fifth tab', disabled: true },
        {
          label: 'Sixth tab',
          id: 'sixth',
          action: (
            <ButtonDropdown
              variant="icon"
              ariaLabel="Query actions for sixth tab"
              items={[
                { id: 'save', text: 'Save', disabled: true },
                { id: 'saveAs', text: 'Save as' },
                { id: 'rename', text: 'Rename', disabled: true },
                { id: 'delete', text: 'Delete', disabled: true },
              ]}
              expandToViewport={true}
            />
          ),
          dismissible: true,
          dismissLabel: 'Dismiss sixth tab',
        },
        {
          label: 'ThistabhasalongheaderwithseveralwordswithoutspacesinitsothatIcantesthowthetextwrapswithhref',
          id: 'seventh',
          href: '/seventh',
          action: (
            <ButtonDropdown
              variant="icon"
              ariaLabel="Query actions for seventh tab"
              items={[
                { id: 'save', text: 'Save', disabled: true },
                { id: 'saveAs', text: 'Save as' },
                { id: 'rename', text: 'Rename', disabled: true },
                { id: 'delete', text: 'Delete', disabled: true },
              ]}
              expandToViewport={true}
            />
          ),
        },
        {
          label: 'ThistabhasalongheaderwithseveralwordswithoutspacesinitsothatIcantesthowthetextwrapswithouthref',
          id: 'eighth',
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
      <h1>Actionable Tabs permutations - small container</h1>
      <div style={{ maxInlineSize: 700 }}>
        <ScreenshotArea>
          <SpaceBetween size="xs">
            <PermutationsView
              permutations={tabActionPermutations}
              render={tabActionPermutation => (
                <Tabs
                  {...tabActionPermutation}
                  i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                />
              )}
            />
            <div style={{ backgroundColor: colorBackgroundLayoutMain }}>
              <PermutationsView
                permutations={tabActionPermutations}
                render={tabActionPermutation => (
                  <Tabs
                    {...tabActionPermutation}
                    i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
                  />
                )}
              />
            </div>
            <PermutationsView
              permutations={tabActionPermutations}
              render={tabActionPermutation => (
                <Tabs
                  {...tabActionPermutation}
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
