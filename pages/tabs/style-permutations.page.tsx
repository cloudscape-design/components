// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Tabs, { TabsProps } from '~components/tabs';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// Rounded with background
const style1 = {
  container: {
    // container styling is tested in pages/container/style-custom.page.tsx
    root: {
      borderRadius: '0px',
    },
  },
  tab: {
    backgroundColor: {
      default: 'light-dark(#f1f5f9, #1e293b)',
      hover: 'light-dark(#dbeafe, #1e3a8a)',
      active: 'light-dark(#2563eb, #1d4ed8)',
      disabled: 'light-dark(#f8fafc, #1e293b)',
    },
    borderColor: {
      default: 'lightblue',
      hover: 'lightblue',
      active: 'lightblue',
      disabled: 'lightblue',
    },
    borderWidth: '2px',
    borderRadius: '40px',
    color: {
      default: 'light-dark(#475569, #94a3b8)',
      hover: 'light-dark(#1e3a8a, #dbeafe)',
      active: 'light-dark(#ffffff, #ffffff)',
      disabled: 'light-dark(#cbd5e1, #64748b)',
    },
    fontSize: '14px',
    fontWeight: '600',
    paddingBlock: '10px',
    paddingInline: '24px',
    focusRing: {
      borderColor: 'light-dark(#f97316, #fb923c)',
      borderRadius: '22px',
      borderWidth: '2px',
    },
    activeIndicator: {
      color: 'transparent',
    },
  },
  tabSeparator: {
    color: 'light-dark(#e2e8f0, #334155)',
    width: '1px',
  },
  header: {
    borderColor: 'light-dark(#cbd5e1, #475569)',
    borderWidth: '2px',
  },
};

// Border colors with background
const style2 = {
  tab: {
    backgroundColor: {
      default: 'light-dark(#fef3c7, #422006)',
      hover: 'light-dark(#fde68a, #713f12)',
      active: 'light-dark(#fbbf24, #d97706)',
      disabled: 'light-dark(#fef9e7, #78350f)',
    },
    borderColor: {
      default: 'transparent',
      hover: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderWidth: '0px',
    borderRadius: '8px 8px 0 0',
    color: {
      default: 'light-dark(#92400e, #fef3c7)',
      hover: 'light-dark(#78350f, #fef9e7)',
      active: 'light-dark(#451a03, #ffffff)',
      disabled: 'light-dark(#cbd5e1, #b5b1a3ff)',
    },
    fontSize: '14px',
    fontWeight: '600',
    paddingBlock: '12px',
    paddingInline: '20px',
    focusRing: {
      borderColor: 'light-dark(#f59e0b, #fbbf24)',
      borderRadius: '8px',
      borderWidth: '2px',
    },
    activeIndicator: {
      color: 'light-dark(#f59e0b, #fbbf24)',
      width: '4px',
      borderRadius: '4px',
    },
  },
  tabSeparator: {
    color: 'light-dark(#fde68a, #78350f)',
    width: '2px',
  },
};

const permutations = createPermutations<TabsProps>([
  {
    tabs: [
      [
        { id: 'first', label: 'First tab', content: 'First tab content' },
        { id: 'second', label: 'Second tab', content: 'Second tab content' },
        { id: 'third', label: 'Third tab', content: 'Third tab content', disabled: true },
      ],
    ],
    activeTabId: ['first', 'second'],
    variant: ['default', 'container', 'stacked'],
    disableContentPaddings: [false, true],
    style: [style1, style2],
  },
]);

export default function TabsStylePermutations() {
  return (
    <>
      <h1>Tabs Style Permutations</h1>

      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Tabs
              {...permutation}
              i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
