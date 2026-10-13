// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FormField from '~components/form-field';
import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { input, multiselect, segmentedControl, select } from './common';

// Validation propagates through FormField context, so errorText/warningText are
// carried on the permutation and applied by render, not passed to ControlGroup.
type ValidationPermutation = ControlGroupProps & { errorText?: string; warningText?: string };

const children = (
  <>
    {input}
    {select}
  </>
);
// Segmented control as the last/button-facing control.
const segmentedChildren = (
  <>
    {input}
    {segmentedControl}
  </>
);
// Multiselect as the last/button-facing control.
const multiselectChildren = (
  <>
    {input}
    {multiselect}
  </>
);
const selectMultiselectChildren = (
  <>
    {select}
    {multiselect}
  </>
);
const directions: ReadonlyArray<ControlGroupProps['direction']> = ['horizontal', 'vertical'];
const actionButtons: ReadonlyArray<ControlGroupProps['actionButton']> = [
  undefined,
  { iconName: 'remove', ariaLabel: 'Remove' },
];
const actionButton: ControlGroupProps['actionButton'] = { iconName: 'remove', ariaLabel: 'Remove' };

// Error and warning are mutually exclusive, so each lives in its own set.
const permutations = createPermutations<ValidationPermutation>([
  { children: [children], errorText: ['This value is required'], direction: directions, actionButton: actionButtons },
  {
    children: [children],
    warningText: ['Double-check this value'],
    direction: directions,
    actionButton: actionButtons,
  },
  {
    children: [segmentedChildren],
    errorText: ['This value is required'],
    direction: directions,
    actionButton: [actionButton],
  },
  {
    children: [segmentedChildren],
    warningText: ['Double-check this value'],
    direction: directions,
    actionButton: [actionButton],
  },
  {
    children: [multiselectChildren, selectMultiselectChildren],
    errorText: ['This value is required'],
    direction: directions,
    actionButton: [actionButton],
  },
  {
    children: [multiselectChildren, selectMultiselectChildren],
    warningText: ['Double-check this value'],
    direction: directions,
    actionButton: [actionButton],
  },
]);

export default function ControlGroupValidation() {
  return (
    <PermutationsPage title="Control group validation" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={({ errorText, warningText, ...controlGroupProps }) => (
          <FormField errorText={errorText} warningText={warningText}>
            <ControlGroup {...controlGroupProps} />
          </FormField>
        )}
      />
    </PermutationsPage>
  );
}
