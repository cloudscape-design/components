// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

// "Beta" is disabled, so "b" matches it first, then "Bravo".
const options: SelectProps.Options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta', disabled: true },
  { value: 'bravo', label: 'Bravo' },
];

function renderSelect() {
  const onChange = jest.fn();
  const { container } = render(
    <Select selectedOption={null} options={options} onChange={event => onChange(event.detail.selectedOption)} />
  );
  return { wrapper: createWrapper(container).findSelect()!, onChange };
}

describe('Select type-ahead', () => {
  test('when closed, selects the first enabled match and skips disabled options', () => {
    const { wrapper, onChange } = renderSelect();
    fireEvent.keyDown(wrapper.findTrigger().getElement(), { key: 'b' });
    expect(onChange).toHaveBeenCalledWith(options[2]);
  });

  test('when open, highlights the first match, including a disabled option', () => {
    const { wrapper, onChange } = renderSelect();
    wrapper.openDropdown();
    fireEvent.keyDown(wrapper.findDropdown().findOptionsContainer()!.getElement(), { key: 'b' });
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('Beta');
    expect(onChange).not.toHaveBeenCalled();
  });
});
