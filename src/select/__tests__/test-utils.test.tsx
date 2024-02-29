// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';
import Select from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { SelectProps } from '../interfaces';

const options: SelectProps.Options = [
  { label: 'First leaf item', value: '1' },
  {
    label: 'First group',
    options: [
      {
        label: 'Second leaf item',
        value: '2',
      },
      {
        label: 'Third leaf item',
        value: '3',
      },
    ],
  },
  { label: 'Third leaf item', value: '2' },
  {
    label: 'Second group',
    options: [
      {
        label: 'Fourth leaf item',
        value: '3',
        lang: 'de',
      },
      {
        label: 'Fifth leaf item',
        value: 'Option 4, test"2',
      },
    ],
  },
];

function renderSelect() {
  const { container } = render(<Select options={options} selectedOption={null} onChange={() => null} />);
  const wrapper = createWrapper(container).findSelect()!;
  return { container, wrapper };
}

describe('test utils', () => {
  describe('findGroups', () => {
    test('returns all groups', () => {});
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    const groups = wrapper.findDropdown()!.findGroups();
    expect(groups[0].getElement()).toHaveTextContent('First group');
    expect(groups[1].getElement()).toHaveTextContent('Second group');
  });
  describe('findGroup', () => {
    test('returns a group by 1-based index', () => {
      const { wrapper } = renderSelect();
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown()!;
      expect(dropdown.findGroup(1)!.getElement()).toHaveTextContent('First group');
      expect(dropdown.findGroup(2)!.getElement()).toHaveTextContent('Second group');
    });
  });
});
