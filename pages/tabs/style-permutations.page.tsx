// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Tabs, { TabsProps } from '~components/tabs';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// No background, underline
const style1 = {
  tabs: {
    backgroundColor: {
      default: 'transparent',
      hover: 'light-dark(rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.15))',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderColor: {
      default: 'transparent',
      hover: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderWidth: '0px',
    borderRadius: '6px',
    color: {
      default: 'light-dark(#64748b, #94a3b8)',
      hover: 'light-dark(#1e293b, #e2e8f0)',
      active: 'light-dark(#0f172a, #ffffff)',
      disabled: 'light-dark(#cbd5e1, #475569)',
    },
    fontSize: '14px',
    fontWeight: '500',
    paddingBlock: '12px',
    paddingInline: '20px',
    focusRing: {
      borderColor: 'light-dark(#3b82f6, #60a5fa)',
      borderRadius: '6px',
      borderWidth: '2px',
    },
  },
  underline: {
    color: 'light-dark(#3b82f6, #60a5fa)',
    width: '3px',
    borderRadius: '3px 3px 0 0',
  },
  divider: {
    color: 'transparent',
    width: '0px',
  },
  headerDivider: {
    color: 'light-dark(#e2e8f0, #334155)',
    width: '1px',
  },
};

// Rounded with background
const style2 = {
  tabs: {
    backgroundColor: {
      default: 'light-dark(#f1f5f9, #1e293b)',
      hover: 'light-dark(#dbeafe, #1e3a8a)',
      active: 'light-dark(#2563eb, #1d4ed8)',
      disabled: 'light-dark(#f8fafc, #1e293b)',
    },
    borderColor: {
      default: 'transparent',
      hover: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderWidth: '0px',
    borderRadius: '20px',
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
  },
  underline: {
    color: 'transparent',
    width: '0px',
    borderRadius: '0px',
  },
  divider: {
    color: 'light-dark(#e2e8f0, #334155)',
    width: '1px',
  },
  headerDivider: {
    color: 'light-dark(#cbd5e1, #475569)',
    width: '1px',
  },
};

// Border colors with background
const style3 = {
  tabs: {
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
      disabled: 'light-dark(#d1d5db, #78350f)',
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
  },
  underline: {
    color: 'light-dark(#f59e0b, #fbbf24)',
    width: '4px',
    borderRadius: '4px 4px 0 0',
  },
  divider: {
    color: 'light-dark(#fde68a, #78350f)',
    width: '1px',
  },
  headerDivider: {
    color: 'light-dark(#fde047, #92400e)',
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
    style: [style1, style2, style3],
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
