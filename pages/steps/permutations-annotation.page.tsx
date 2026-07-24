// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Icon } from '~components';
import Steps, { StepsProps } from '~components/steps';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

export const stepsWithAnnotation: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2024-05-01T15:01:23Z">3:01:23 PM</time>,
    status: 'log',
    header: 'Provided preferences',
  },
  {
    annotation: <time dateTime="2024-05-01T15:03:10Z">3:03:10 PM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Created environment',
  },
  {
    annotation: <time dateTime="2024-05-01T15:04:45Z">3:04:45 PM</time>,
    status: 'error',
    statusIconAriaLabel: 'Error',
    header: 'Validation failed',
    details: 'One or more resources could not be validated.',
  },
];

export const varyingLengthAnnotationsSteps: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2024-05-01T09:00:00Z">May 05, 2024, 9:00 AM</time>,
    status: 'log',
    header: 'Shorter timestamp',
  },
  {
    annotation: (
      <time dateTime="2024-12-31T23:59:59+14:00" title="December 31, 2024, 11:59:59 PM">
        December 31, 2024, 11:59 PM
      </time>
    ),
    status: 'log',
    header: 'Long timestamp',
  },
  {
    status: 'loading',
    header: 'No annotation yet',
  },
];

const stepsPermutations = createPermutations<StepsProps>([
  {
    steps: [varyingLengthAnnotationsSteps, stepsWithAnnotation],
    ariaLabel: ['test label'],
    orientation: ['vertical', 'horizontal'],
    renderStep: [
      undefined,
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
