// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import {
  autosuggest,
  DirectionSettings,
  input,
  multiselect,
  segmentedControl,
  select,
  useControlGroupDirection,
} from './common';

const permutations = createPermutations<ControlGroupProps>([
  {
    children: [
      input,
      <>
        {input}
        {select}
      </>,
      <>
        {autosuggest}
        {segmentedControl}
      </>,
      <>
        {input}
        {select}
        {input}
      </>,
      <>
        {autosuggest}
        {select}
        {multiselect}
      </>,
      <>
        {input}
        {select}
        {multiselect}
        {input}
      </>,
    ],
    actionButton: [
      { iconName: 'remove', ariaLabel: 'Remove' },
      { iconName: 'close', ariaLabel: 'Close' },
      { iconName: 'remove', ariaLabel: 'Remove', disabled: true },
      {
        iconName: 'remove',
        ariaLabel: 'Remove',
        disabled: true,
        disabledReason: 'Cannot remove the last clause',
      },
    ],
  },
]);

export default function ControlGroupActionPermutations() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <PermutationsPage
      title="Control group action button"
      i18n={{}}
      settings={<DirectionSettings direction={direction} setDirection={setDirection} />}
    >
      <PermutationsView
        permutations={permutations}
        render={permutation => <ControlGroup {...permutation} direction={direction} />}
      />
    </PermutationsPage>
  );
}
