// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps, { StepsProps } from '~components/steps';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import * as variants from './permutations-utils';

const stepsPermutations = createPermutations<StepsProps>([
  {
    connectorLines: ['visible'],
    orientation: ['vertical', 'horizontal'],
    steps: [
      variants.initialSteps,
      variants.loadingSteps,
      variants.loadingSteps2,
      variants.loadingSteps3,
      variants.successfulSteps,
      variants.blockedSteps,
      variants.failedSteps,
      variants.allStatusesSteps,
      variants.initialStepsInteractive,
      variants.loadingStepsInteractive,
      variants.loadingSteps2Interactive,
      variants.loadingSteps3Interactive,
      variants.successfulStepsInteractive,
      variants.blockedStepsInteractive,
      variants.failedStepsInteractive,
      variants.failedStepsWithRetryTextInteractive,
      variants.failedStepsWithRetryButtonInteractive,
      variants.changesetStepsInteractive,
    ],
    ariaLabel: ['test label'],
  },
  {
    connectorLines: ['none'],
    orientation: ['vertical', 'horizontal'],
    steps: [variants.successfulSteps],
    ariaLabel: ['test label'],
  },
]);

export default function StepsPermutations() {
  return (
    <SimplePage screenshotArea={{ disableAnimations: true }} title="Steps permutations">
      <PermutationsView
        permutations={stepsPermutations}
        render={permutation => <div>{<Steps {...permutation} />}</div>}
      />
    </SimplePage>
  );
}
