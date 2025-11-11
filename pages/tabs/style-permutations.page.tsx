// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Tabs, { TabsProps } from '~components/tabs';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

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
    style: [
      {
        tabs: {
          backgroundColor: {
            default: 'light-dark(#f0f9ff, #1e293b)',
            hover: 'light-dark(#e0f2fe, #334155)',
            active: 'light-dark(#bae6fd, #0f172a)',
            disabled: 'light-dark(#f8fafc, #334155)',
          },
          borderColor: {
            default: 'light-dark(#0ea5e9, #0284c7)',
            hover: 'light-dark(#0284c7, #0369a1)',
            active: 'light-dark(#0369a1, #0ea5e9)',
            disabled: 'light-dark(#e0f2fe, #334155)',
          },
          borderWidth: '0px',
          borderRadius: '8px 8px 0 0',
          color: {
            default: 'light-dark(#0c4a6e, #e0f2fe)',
            hover: 'light-dark(#075985, #f0f9ff)',
            active: 'light-dark(#0c4a6e, #ffffff)',
            disabled: 'light-dark(#94a3b8, #64748b)',
          },
          fontSize: '15px',
          fontWeight: '600',
          paddingBlock: '12px',
          paddingInline: '20px',
          focusRing: {
            borderColor: 'light-dark(#0ea5e9, #0284c7)',
            borderRadius: '8px',
            borderWidth: '2px',
          },
        },
        underline: {
          color: 'light-dark(#0ea5e9, #06b6d4)',
          width: '3px',
          borderRadius: '3px 3px 0 0',
        },
        divider: {
          color: 'light-dark(#e0f2fe, #334155)',
          width: '1px',
        },
        headerDivider: {
          color: 'light-dark(#bae6fd, #475569)',
          width: '2px',
        },
      },
      {
        tabs: {
          backgroundColor: {
            default: 'transparent',
            hover: 'light-dark(#f8fafc, #1e293b)',
            active: 'light-dark(#f1f5f9, #0f172a)',
            disabled: 'transparent',
          },
          borderColor: {
            default: 'transparent',
            hover: 'transparent',
            active: 'transparent',
            disabled: 'transparent',
          },
          borderWidth: '0px',
          borderRadius: '0px',
          color: {
            default: 'light-dark(#64748b, #cbd5e1)',
            hover: 'light-dark(#1e293b, #f1f5f9)',
            active: 'light-dark(#0f172a, #ffffff)',
            disabled: 'light-dark(#cbd5e1, #475569)',
          },
          fontSize: '14px',
          fontWeight: '500',
          paddingBlock: '10px',
          paddingInline: '16px',
        },
        underline: {
          color: 'light-dark(#0f172a, #e2e8f0)',
          width: '2px',
          borderRadius: '2px 2px 0 0',
        },
        divider: {
          color: 'transparent',
          width: '0px',
        },
        headerDivider: {
          color: 'light-dark(#e2e8f0, #475569)',
          width: '1px',
        },
      },
      {
        tabs: {
          backgroundColor: {
            default: 'light-dark(#faf5ff, #1e1b4b)',
            hover: 'light-dark(#f3e8ff, #312e81)',
            active: 'light-dark(#e9d5ff, #1e1b4b)',
            disabled: 'light-dark(#faf5ff, #312e81)',
          },
          borderColor: {
            default: 'light-dark(#a855f7, #9333ea)',
            hover: 'light-dark(#9333ea, #a855f7)',
            active: 'light-dark(#7e22ce, #c084fc)',
            disabled: 'light-dark(#f3e8ff, #4c1d95)',
          },
          borderWidth: '2px',
          borderRadius: '12px 12px 0 0',
          color: {
            default: 'light-dark(#6b21a8, #e9d5ff)',
            hover: 'light-dark(#581c87, #f3e8ff)',
            active: 'light-dark(#4c1d95, #faf5ff)',
            disabled: 'light-dark(#c4b5fd, #6b21a8)',
          },
          fontSize: '16px',
          fontWeight: '600',
          paddingBlock: '14px',
          paddingInline: '24px',
          focusRing: {
            borderColor: 'light-dark(#a855f7, #c084fc)',
            borderRadius: '12px',
            borderWidth: '3px',
          },
        },
        underline: {
          color: 'light-dark(#a855f7, #c084fc)',
          width: '4px',
          borderRadius: '4px 4px 0 0',
        },
        divider: {
          color: 'light-dark(#f3e8ff, #4c1d95)',
          width: '2px',
        },
        headerDivider: {
          color: 'light-dark(#e9d5ff, #6b21a8)',
          width: '3px',
        },
      },
      {
        tabs: {
          backgroundColor: {
            default: 'light-dark(#f0fdf4, #14532d)',
            hover: 'light-dark(#dcfce7, #166534)',
            active: 'light-dark(#bbf7d0, #14532d)',
            disabled: 'light-dark(#f7fee7, #1e3a8a)',
          },
          borderColor: {
            default: 'light-dark(#10b981, #059669)',
            hover: 'light-dark(#059669, #10b981)',
            active: 'light-dark(#047857, #34d399)',
            disabled: 'light-dark(#d1fae5, #1e40af)',
          },
          borderWidth: '0px',
          borderRadius: '10px 10px 0 0',
          color: {
            default: 'light-dark(#065f46, #d1fae5)',
            hover: 'light-dark(#047857, #ecfdf5)',
            active: 'light-dark(#064e3b, #f0fdf4)',
            disabled: 'light-dark(#a7f3d0, #475569)',
          },
          fontSize: '15px',
          fontWeight: '600',
          paddingBlock: '12px',
          paddingInline: '18px',
          focusRing: {
            borderColor: 'light-dark(#10b981, #34d399)',
            borderRadius: '10px',
            borderWidth: '2px',
          },
        },
        underline: {
          color: 'light-dark(#10b981, #34d399)',
          width: '3px',
          borderRadius: '3px 3px 0 0',
        },
        divider: {
          color: 'light-dark(#d1fae5, #1e3a8a)',
          width: '1px',
        },
        headerDivider: {
          color: 'light-dark(#a7f3d0, #334155)',
          width: '2px',
        },
      },
    ],
  },
]);

export default function TabsStylePermutations() {
  return (
    <>
      <h1>Tabs Style Permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Tabs {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
