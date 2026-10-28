// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const HOME = 36;
const END = 35;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function renderComponent(props: Partial<SelectProps> = {}) {
  const { container } = render(<Select selectedOption={null} onChange={() => {}} options={options} {...props} />);
  const wrapper = createWrapper(container).findSelect()!;
  wrapper.openDropdown();
  return wrapper;
}

const highlightedLabel = (wrapper: ReturnType<typeof renderComponent>) =>
  wrapper.findDropdown().findHighlightedOption()?.findLabel().getElement().textContent;

describe('Select Home and End', () => {
  test('without filtering, moves the highlight and prevents the native page scroll', () => {
    const wrapper = renderComponent();
    const list = wrapper.findDropdown().findOptionsContainer()!.getElement();

    expect(fireEvent.keyDown(list, { keyCode: END })).toBe(false);
    expect(highlightedLabel(wrapper)).toBe('Cherry');

    expect(fireEvent.keyDown(list, { keyCode: HOME })).toBe(false);
    expect(highlightedLabel(wrapper)).toBe('Apple');
  });

  test('with filtering, moves the highlight and keeps the native cursor movement in the filter input', () => {
    const wrapper = renderComponent({ filteringType: 'auto' });
    const input = wrapper.findFilteringInput()!.findNativeInput().getElement();

    expect(fireEvent.keyDown(input, { keyCode: END })).toBe(true);
    expect(highlightedLabel(wrapper)).toBe('Cherry');

    expect(fireEvent.keyDown(input, { keyCode: HOME })).toBe(true);
    expect(highlightedLabel(wrapper)).toBe('Apple');
  });
});
