// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const permutations = createPermutations<DrawerProps>([
  // Paddings and slots
  {
    disableContentPaddings: [true, false],
    header: [null, <h2 key="header">Header</h2>],
    children: [null, <>Dummy content</>],
    footer: [null, <>Footer content</>],
  },
  // Loading state
  { loading: [true], i18nStrings: [{ loadingText: 'Loading' }, {}] },
  // Header actions
  {
    header: [<h2 key="header">Header with actions</h2>],
    headerActions: [<Button key="action">Action</Button>],
    hideCloseAction: [false, true],
    children: [<>Dummy content</>],
  },
  // Header close action
  {
    header: [<h2 key="header">Header close action</h2>],
    closeAction: [{ ariaLabel: 'Close drawer' }],
    hideCloseAction: [false, true],
    children: [<>Dummy content</>],
  },
  // Header actions and close action
  {
    header: [<h2 key="header">Header with actions and close action</h2>],
    headerActions: [<Button key="action">Action</Button>],
    closeAction: [{ ariaLabel: 'Close drawer', iconName: 'angle-right' }],
    hideCloseAction: [false, true],
    children: [<>Dummy content</>],
  },
]);

export default function () {
  return (
    <SimplePage title="Drawer permutations" screenshotArea={{ disableAnimations: true }}>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <>
            {!permutation.header && !permutation.children && !permutation.loading && <p>(empty permutation)</p>}
            {/* add visible border to capture component paddings */}
            <div style={{ border: '1px solid red' }}>
              <Drawer {...permutation} />
            </div>
          </>
        )}
      />
    </SimplePage>
  );
}
