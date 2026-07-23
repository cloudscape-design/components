// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Icon } from '~components';
import Steps, { StepsProps } from '~components/steps';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import * as variants from './permutations-utils';

const stepsPermutations = createPermutations<StepsProps>([
  {
    steps: [variants.allStatusesSteps, variants.successfulSteps, variants.timelineStepsWithVaryingAnnotations],
    ariaLabel: ['test label'],
    orientation: ['vertical', 'horizontal'],
    renderStep: [
      step => ({
        header: <b>This step header ({step.header}) is wrapped in a custom HTML tag and has very long content</b>,
        details: step.details && <i>Custom details for {step.details}</i>,
      }),
      step => ({
        header: step.header,
        details: step.details && <i>Custom details for {step.details}</i>,
        icon: <Icon ariaLabel="success" name="status-positive" variant="success" />,
      }),
      step => ({
        annotation: step.annotation,
        header: step.header,
        details: step.details && <i>Custom details for {step.details}</i>,
        icon: <Icon ariaLabel="log" name="dot" variant="normal" />,
      }),
    ],
  },
]);

export default function StepsPermutations() {
  return (
    <SimplePage screenshotArea={{ disableAnimations: true }} title="Steps permutations: custom steps">
      <PermutationsView
        permutations={stepsPermutations}
        render={permutation => <div>{<Steps {...permutation} />}</div>}
      />
    </SimplePage>
  );
}
