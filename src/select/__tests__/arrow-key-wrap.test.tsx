// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const HOME = 36;
const END = 35;

function renderSelect(options: SelectProps.Options) {
  const { container } = render(<Select selectedOption={null} onChange={() => {}} options={options} />);
  const wrapper = createWrapper(container).findSelect()!;
  wrapper.openDropdown();
  const list = wrapper.findDropdown().findOptionsContainer()!;
  const highlighted = () => wrapper.findDropdown().findHighlightedOption()?.findLabel().getElement().textContent;
  return { list, highlighted };
}

describe('Select arrow key wrapping', () => {
  const withEmptyGroups: SelectProps.Options = [
    { label: 'Empty start', value: 'g0', options: [] },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Empty end', value: 'g1', options: [] },
  ];

  test('ArrowDown on the last option wraps to the first when the list ends with an empty group', () => {
    const { list, highlighted } = renderSelect(withEmptyGroups);
    list.keydown(END);
    expect(highlighted()).toBe('Banana');
    list.keydown(KeyCode.down);
    expect(highlighted()).toBe('Apple');
  });

  test('ArrowUp on the first option wraps to the last when the list starts with an empty group', () => {
    const { list, highlighted } = renderSelect(withEmptyGroups);
    list.keydown(HOME);
    expect(highlighted()).toBe('Apple');
    list.keydown(KeyCode.up);
    expect(highlighted()).toBe('Banana');
  });

  test('still wraps when the list starts with a group that has options', () => {
    const { list, highlighted } = renderSelect([
      { label: 'Fruits', value: 'fruits', options: [{ label: 'Apple', value: 'apple' }] },
      { label: 'Banana', value: 'banana' },
    ]);
    list.keydown(HOME);
    expect(highlighted()).toBe('Apple');
    list.keydown(KeyCode.up);
    expect(highlighted()).toBe('Banana');
    list.keydown(KeyCode.down);
    expect(highlighted()).toBe('Apple');
  });
});
