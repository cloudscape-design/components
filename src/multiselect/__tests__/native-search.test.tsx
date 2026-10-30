// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';

const options: MultiselectProps.Options = [
  {
    label: 'Compute',
    value: 'compute',
    options: [
      { label: 'EC2', value: 'ec2' },
      { label: 'Lambda', value: 'lambda' },
      { label: 'Fargate', value: 'fargate' },
    ],
  },
  { label: 'Glacier', value: 'glacier' },
];

function renderMultiselect(props: Partial<MultiselectProps> = {}) {
  const onChange = jest.fn();
  const { container } = render(
    <Multiselect options={options} selectedOptions={[]} onChange={onChange} filteringType="none" {...props} />
  );
  const wrapper = createWrapper(container).findMultiselect()!;
  wrapper.openDropdown();
  const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
  const type = (key: string) => optionsContainer.keydown({ key });
  const getHighlightedLabel = () =>
    wrapper.findDropdown().findHighlightedOption()?.findLabel().getElement().textContent;
  return { wrapper, onChange, optionsContainer, type, getHighlightedLabel };
}

describe('Multiselect native search', () => {
  test('highlights the matching option inside a group rather than the group', () => {
    const { type, getHighlightedLabel } = renderMultiselect();
    type('e');
    expect(getHighlightedLabel()).toBe('EC2');
  });

  test('Enter after typing selects only the matching option inside a group', () => {
    const { optionsContainer, type, onChange } = renderMultiselect();
    type('e');
    optionsContainer.keydown(KeyCode.enter);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail.selectedOptions).toEqual([{ label: 'EC2', value: 'ec2' }]);
  });

  test('highlights a group when its own label matches', () => {
    const { type, getHighlightedLabel } = renderMultiselect();
    type('c');
    expect(getHighlightedLabel()).toBe('Compute');
  });

  test('repeating a character does not cycle into group children that do not match', () => {
    const { type, getHighlightedLabel } = renderMultiselect();
    type('c');
    type('c');
    expect(getHighlightedLabel()).toBe('Compute');
  });

  test('typing right after selecting with Space moves the highlight to the matching option', () => {
    const { optionsContainer, type, onChange, getHighlightedLabel } = renderMultiselect();
    // Highlight with the arrow keys so the type-ahead buffer is empty before Space is pressed.
    optionsContainer.keydown(KeyCode.down);
    expect(getHighlightedLabel()).toBe('EC2');
    optionsContainer.keydown({ keyCode: KeyCode.space, key: ' ' });
    expect(onChange.mock.calls[0][0].detail.selectedOptions).toEqual([{ label: 'EC2', value: 'ec2' }]);
    type('g');
    expect(getHighlightedLabel()).toBe('Glacier');
  });
});
