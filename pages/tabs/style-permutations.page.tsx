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
    variant: ['default', 'container', 'stacked'],
    disableContentPaddings: [false, true],
    style: [
      // Minimal Modern - no background, clean underline
      {
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
      },
      // Pill Style - rounded with subtle background
      {
        tabs: {
          backgroundColor: {
            default: 'light-dark(#f1f5f9, #1e293b)',
            hover: 'light-dark(#e0e7ff, #312e81)',
            active: 'light-dark(#6366f1, #4f46e5)',
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
            hover: 'light-dark(#4338ca, #c7d2fe)',
            active: 'light-dark(#ffffff, #ffffff)',
            disabled: 'light-dark(#cbd5e1, #64748b)',
          },
          fontSize: '14px',
          fontWeight: '600',
          paddingBlock: '10px',
          paddingInline: '24px',
          focusRing: {
            borderColor: 'light-dark(#6366f1, #818cf8)',
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
      },
      // Bold Accent - strong colors with background
      {
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
      },
      // Elegant Teal - sophisticated with borders
      {
        tabs: {
          backgroundColor: {
            default: 'transparent',
            hover: 'light-dark(#f0fdfa, #134e4a)',
            active: 'light-dark(#ffffff, #0f766e)',
            disabled: 'transparent',
          },
          borderColor: {
            default: 'light-dark(#d1fae5, #2dd4bf)',
            hover: 'light-dark(#14b8a6, #5eead4)',
            active: 'light-dark(#0d9488, #14b8a6)',
            disabled: 'light-dark(#e5e7eb, #374151)',
          },
          borderWidth: '2px',
          borderRadius: '10px 10px 0 0',
          color: {
            default: 'light-dark(#0f766e, #99f6e4)',
            hover: 'light-dark(#115e59, #5eead4)',
            active: 'light-dark(#134e4a, #ffffff)',
            disabled: 'light-dark(#9ca3af, #6b7280)',
          },
          fontSize: '14px',
          fontWeight: '600',
          paddingBlock: '12px',
          paddingInline: '20px',
          focusRing: {
            borderColor: 'light-dark(#14b8a6, #2dd4bf)',
            borderRadius: '10px',
            borderWidth: '2px',
          },
        },
        underline: {
          color: 'transparent',
          width: '0px',
          borderRadius: '0px',
        },
        divider: {
          color: 'light-dark(#ccfbf1, #134e4a)',
          width: '1px',
        },
        headerDivider: {
          color: 'light-dark(#99f6e4, #0f766e)',
          width: '2px',
        },
      },
      // Cool Minimalist - subtle grays with accent
      {
        tabs: {
          backgroundColor: {
            default: 'transparent',
            hover: 'light-dark(#f8fafc, #1e293b)',
            active: 'light-dark(#f1f5f9, #334155)',
            disabled: 'transparent',
          },
          borderColor: {
            default: 'transparent',
            hover: 'transparent',
            active: 'light-dark(#e2e8f0, #64748b)',
            disabled: 'transparent',
          },
          borderWidth: '0px 0px 2px 0px',
          borderRadius: '0px',
          color: {
            default: 'light-dark(#64748b, #94a3b8)',
            hover: 'light-dark(#334155, #cbd5e1)',
            active: 'light-dark(#0f172a, #f1f5f9)',
            disabled: 'light-dark(#cbd5e1, #475569)',
          },
          fontSize: '14px',
          fontWeight: '500',
          paddingBlock: '12px',
          paddingInline: '20px',
          focusRing: {
            borderColor: 'light-dark(#94a3b8, #cbd5e1)',
            borderRadius: '4px',
            borderWidth: '2px',
          },
        },
        underline: {
          color: 'light-dark(#0f172a, #f1f5f9)',
          width: '3px',
          borderRadius: '3px 3px 0 0',
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
      // Vibrant Rose - energetic and modern
      {
        tabs: {
          backgroundColor: {
            default: 'light-dark(#fff1f2, #4c0519)',
            hover: 'light-dark(#ffe4e6, #881337)',
            active: 'light-dark(#fb7185, #e11d48)',
            disabled: 'light-dark(#fff5f7, #881337)',
          },
          borderColor: {
            default: 'transparent',
            hover: 'transparent',
            active: 'transparent',
            disabled: 'transparent',
          },
          borderWidth: '0px',
          borderRadius: '12px 12px 0 0',
          color: {
            default: 'light-dark(#9f1239, #fecdd3)',
            hover: 'light-dark(#881337, #ffe4e6)',
            active: 'light-dark(#ffffff, #ffffff)',
            disabled: 'light-dark(#d1d5db, #881337)',
          },
          fontSize: '14px',
          fontWeight: '600',
          paddingBlock: '12px',
          paddingInline: '20px',
          focusRing: {
            borderColor: 'light-dark(#f43f5e, #fb7185)',
            borderRadius: '12px',
            borderWidth: '2px',
          },
        },
        underline: {
          color: 'light-dark(#f43f5e, #fda4af)',
          width: '3px',
          borderRadius: '3px 3px 0 0',
        },
        divider: {
          color: 'light-dark(#fecdd3, #881337)',
          width: '1px',
        },
        headerDivider: {
          color: 'light-dark(#fda4af, #9f1239)',
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
