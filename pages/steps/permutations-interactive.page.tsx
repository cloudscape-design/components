// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps from '~components/steps';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { stepsPermutationsInteractive } from './permutationts-utils';

export default function StepsInteractivePermutations() {
  return (
    <ScreenshotArea disableAnimations={false}>
      <article>
        <h1>Steps interactive permutations</h1>
        <PermutationsView
          permutations={stepsPermutationsInteractive}
          render={permutation => <div>{<Steps {...permutation} />}</div>}
        />
      </article>
    </ScreenshotArea>
  );
}
