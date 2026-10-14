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
      autosuggest,
      segmentedControl,
      select,
      multiselect,
      <>
        {input}
        {select}
      </>,
      <>
        {input}
        {segmentedControl}
      </>,
      <>
        {autosuggest}
        {select}
      </>,
      <>
        {autosuggest}
        {segmentedControl}
      </>,
      <>
        {select}
        {multiselect}
      </>,
      <>
        {multiselect}
        {select}
      </>,
      <>
        {input}
        {select}
        {input}
      </>,
      <>
        {autosuggest}
        {select}
        {autosuggest}
      </>,
      <>
        {input}
        {multiselect}
        {input}
      </>,
      <>
        {autosuggest}
        {multiselect}
        {autosuggest}
      </>,
    ],
  },
]);

export default function ControlGroupPermutations() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <PermutationsPage
      title="Control group permutations"
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
