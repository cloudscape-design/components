// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { MultiselectProps } from '../interfaces';

export const optionsWithGroups: MultiselectProps.Options = [
  { label: 'First option', value: '1' },
  {
    label: 'First group',
    options: [
      {
        label: 'Second option',
        value: '2',
      },
      {
        label: 'Third option',
        value: '3',
      },
    ],
  },
  { label: 'Fourth option', value: '4' },
  {
    label: 'Second group',
    options: [
      {
        label: 'Fifth option',
        value: '5',
      },
      {
        label: 'Sixth option',
        value: '6',
      },
    ],
  },
];

export const optionsWithoutGroups = optionsWithGroups.reduce(
  (previousValue: MultiselectProps.Option[], currentValue: MultiselectProps.Option) => {
    if ('options' in currentValue) {
      return [...previousValue, ...(currentValue as MultiselectProps.OptionGroup).options];
    }
    return [...previousValue, currentValue];
  },
  []
);

export function renderMultiselect(props?: Partial<MultiselectProps>) {
  const { container } = render(
    <Multiselect options={optionsWithGroups} selectedOptions={[]} onChange={() => null} {...props} />
  );
  const wrapper = createWrapper(container).findMultiselect()!;
  return { wrapper };
}
