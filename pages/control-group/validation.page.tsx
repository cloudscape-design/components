// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FormField from '~components/form-field';
import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { input, multiselect, segmentedControl, select } from './common';

type ValidationPermutation = ControlGroupProps & { errorText?: string; warningText?: string };

const children = [
  <>
    {input}
    {select}
  </>,
  <>
    {input}
    {segmentedControl}
  </>,
  <>
    {select}
    {multiselect}
  </>,
  <>
    {input}
    {select}
    {multiselect}
  </>,
  <>
    {input}
    {segmentedControl}
    {select}
  </>,
  <>
    {select}
    {input}
    {multiselect}
  </>,
];

const directions: ReadonlyArray<ControlGroupProps['direction']> = ['horizontal', 'vertical'];

const actionButtons: ReadonlyArray<ControlGroupProps['actionButton']> = [
  undefined,
  { iconName: 'remove', ariaLabel: 'Remove' },
];

const labels = [undefined, 'Label'];

const permutations = createPermutations<ValidationPermutation>([
  { children, errorText: ['This value is required'], direction: directions, actionButton: actionButtons },
  {
    children,
    warningText: ['Double-check this value'],
    direction: directions,
    actionButton: actionButtons,
    inlineLabelText: labels,
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
