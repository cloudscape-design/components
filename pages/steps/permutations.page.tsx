// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps from '~components/steps';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { stepsPermutations } from './permutations-utils';

export default function StepsPermutations() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>Steps permutations</h1>
        <PermutationsView
          permutations={stepsPermutations}
          render={permutation => <div>{<Steps {...permutation} />}</div>}
        />
      </article>
    </ScreenshotArea>
  );
}
