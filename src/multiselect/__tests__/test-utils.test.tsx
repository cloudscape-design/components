// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';
import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { MultiselectProps } from '../interfaces';

const options: MultiselectProps.Options = [
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

function renderMultiselect(props?: Partial<MultiselectProps>) {
  const { container } = render(<Multiselect options={options} selectedOptions={[]} onChange={() => null} {...props} />);
  const wrapper = createWrapper(container).findMultiselect()!;
  return { container, wrapper };
}

describe('test utils', () => {
  describe('findGroups', () => {
    test('returns all groups', () => {});
    const { wrapper } = renderMultiselect();
    wrapper.openDropdown();
    const groups = wrapper.findDropdown()!.findGroups();
    expect(groups[0].getElement()).toHaveTextContent('First group');
    expect(groups[1].getElement()).toHaveTextContent('Second group');
  });
  describe('findGroup', () => {
    test('returns a group by 1-based index', () => {
      const { wrapper } = renderMultiselect();
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown()!;
      expect(dropdown.findGroup(1)!.getElement()).toHaveTextContent('First group');
      expect(dropdown.findGroup(2)!.getElement()).toHaveTextContent('Second group');
    });
  });
});
