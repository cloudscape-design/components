// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Drawer, type DrawerProps } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<DrawerProps>([
  {
    disableContentPaddings: [true, false],
    header: [null, <h2 key="header">Header</h2>],
    children: [null, <>Dummy content</>],
    footer: [null, <>Footer content</>],
  },
  { loading: [true], i18nStrings: [{ loadingText: 'Loading' }, {}] },
]);

export default function () {
  return (
    <>
      <h1>Drawer permutations</h1>
      <ScreenshotArea disableAnimations={true}>
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
      </ScreenshotArea>
    </>
  );
}
