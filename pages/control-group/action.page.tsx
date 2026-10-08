// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Select from '~components/select';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { DirectionSettings, noop, operators, useControlGroupDirection } from './common';

const input = <Input ariaLabel="Value" value="service" onChange={noop} />;
const select = <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />;

const permutations = createPermutations<InternalControlGroupProps>([
  {
    children: [
      input,
      <>
        {input}
        {select}
      </>,
    ],
    actionButton: [
      { iconName: 'remove', ariaLabel: 'Remove' },
      { iconName: 'close', ariaLabel: 'Close' },
    ],
  },
]);

export default function ControlGroupActionPermutations() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <PermutationsPage
      title="Control group action slot"
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
