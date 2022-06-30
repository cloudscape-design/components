// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ProgressBar from '~components/progress-bar';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import permutations from './permutations-utils';

export default function ProgressBarPermutations() {
  return (
    <article>
      <h1>ProgressBar permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div>
              <ProgressBar {...permutation} />
              <hr />
            </div>
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
