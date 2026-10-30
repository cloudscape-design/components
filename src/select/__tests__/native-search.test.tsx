// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const options: SelectProps.Options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' },
];

const space = { keyCode: KeyCode.space, key: ' ' };

function renderSelect() {
  const onChange = jest.fn();
  const { container } = render(<Select options={options} selectedOption={null} onChange={onChange} />);
  const wrapper = createWrapper(container).findSelect()!;
  const getHighlightedLabel = () =>
    wrapper.findDropdown().findHighlightedOption()?.findLabel().getElement().textContent;
  return { wrapper, onChange, getHighlightedLabel };
}

describe('Select native search', () => {
  test('typing right after opening the dropdown with Space highlights the matching option', () => {
    const { wrapper, getHighlightedLabel } = renderSelect();
    wrapper.findTrigger().keydown(space);
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
    wrapper.findDropdown().findOptionsContainer()!.keydown({ key: 'g' });
    expect(getHighlightedLabel()).toBe('Grape');
  });

  test('typing right after selecting with Space selects the matching option', () => {
    const { wrapper, onChange } = renderSelect();
    wrapper.findTrigger().keydown(KeyCode.down);
    wrapper.findDropdown().findOptionsContainer()!.keydown(space);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail.selectedOption).toEqual({ label: 'Apple', value: 'apple' });
    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    wrapper.findTrigger().keydown({ key: 'g' });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].detail.selectedOption).toEqual({ label: 'Grape', value: 'grape' });
  });

  test('typing a group label prefix does not select an option inside that group', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select
        options={[{ label: 'Compute', options: [{ label: 'EC2', value: 'ec2' }] }]}
        selectedOption={null}
        onChange={onChange}
      />
    );
    createWrapper(container).findSelect()!.findTrigger().keydown({ key: 'c' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
