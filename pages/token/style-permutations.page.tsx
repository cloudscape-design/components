// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import Token, { TokenProps } from '~components/token';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const roundedPillStyle: TokenProps['style'] = {
  root: {
    background: {
      default: 'light-dark(#eef2ff, #2e1065)',
      hover: 'light-dark(#dbeafe, #3b0764)',
      disabled: 'light-dark(#f1f5f9, #1e1b2e)',
    },
    borderColor: {
      default: 'light-dark(#c7d2fe, #6d28d9)',
      hover: 'light-dark(#93c5fd, #7c3aed)',
      disabled: 'light-dark(#e2e8f0, #334155)',
    },
    borderRadius: '24px',
    paddingBlock: '4px',
    paddingInline: '12px',
    color: {
      default: 'light-dark(#4338ca, #c4b5fd)',
      hover: 'light-dark(#3730a3, #ddd6fe)',
      disabled: 'light-dark(#94a3b8, #475569)',
    },
  },
  dismissButton: {
    color: {
      default: 'light-dark(#6366f1, #a78bfa)',
      hover: 'light-dark(#4338ca, #c4b5fd)',
      disabled: 'light-dark(#cbd5e1, #475569)',
    },
    focusRing: {
      borderColor: 'light-dark(#6366f1, #a78bfa)',
      borderRadius: '12px',
      borderWidth: '2px',
    },
  },
};

const greenOutlineStyle: TokenProps['style'] = {
  root: {
    background: {
      default: 'light-dark(#ecfdf5, #022c22)',
      hover: 'light-dark(#d1fae5, #064e3b)',
      disabled: 'light-dark(#f8fafc, #1e1b2e)',
    },
    borderColor: {
      default: 'light-dark(#6ee7b7, #059669)',
      hover: 'light-dark(#34d399, #10b981)',
      disabled: 'light-dark(#e2e8f0, #334155)',
    },
    borderRadius: '6px',
    borderWidth: '2px',
    paddingBlock: '4px',
    paddingInline: '10px',
    color: {
      default: 'light-dark(#065f46, #6ee7b7)',
      hover: 'light-dark(#064e3b, #a7f3d0)',
      disabled: 'light-dark(#94a3b8, #475569)',
    },
  },
};

const permutations = createPermutations<TokenProps>([
  {
    label: ['Styled token'],
    icon: [undefined, <Icon key="icon" name="settings" />],
    onDismiss: [() => {}],
    disabled: [false, true],
    variant: ['normal', 'inline'],
    style: [roundedPillStyle, greenOutlineStyle],
  },
]);

export default function TokenStylePermutations() {
  return (
    <SimplePage title="Token Style permutations" screenshotArea={{ disableAnimations: true }}>
      <PermutationsView
        permutations={permutations}
        render={(permutation, index) => <Token {...permutation} dismissLabel={`Dismiss ${index}`} />}
      />
    </SimplePage>
  );
}
