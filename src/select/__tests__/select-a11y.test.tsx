// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const VALUE_WITH_SPECIAL_CHARS = 'Option 4, test"2';
const defaultOptions: SelectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  {
    label: 'Group',
    options: [
      {
        label: 'Third',
        value: '3',
      },
      {
        label: 'Forth',
        value: VALUE_WITH_SPECIAL_CHARS,
      },
    ],
  },
];

function expectLiveRegionText(expectedText: string) {
  const liveRegion = createWrapper().findLiveRegion()!.getElement();
  expect(liveRegion).toHaveTextContent(expectedText);
}

describe.each([false, true])('expandToViewport=%s', expandToViewport => {
  const defaultProps = {
    options: defaultOptions,
    selectedOption: null,
    onChange: () => {},
    expandToViewport,
  };

  function renderSelect(props?: Partial<SelectProps>) {
    const { container } = render(<Select {...defaultProps} {...props} ariaLabel="select" />);
    const wrapper = createWrapper(container).findSelect()!;
    return { container, wrapper };
  }

  test('with opened dropdown', async () => {
    const { container, wrapper } = renderSelect();
    wrapper.openDropdown();
    expect(wrapper.findDropdown({ expandToViewport })!.findOptionByValue('1')).toBeTruthy();
    await expect(container).toValidateA11y();
  });

  test('with filtering', async () => {
    const { container, wrapper } = renderSelect({ filteringType: 'auto', filteringAriaLabel: 'Filter' });
    wrapper.openDropdown();
    expect(wrapper.findDropdown({ expandToViewport })!.findOptionByValue('1')).toBeTruthy();
    await expect(container).toValidateA11y();
  });

  test('Option should have aria-selected', () => {
    const { wrapper } = renderSelect({ selectedOption: { label: 'First', value: '1' } });
    wrapper.openDropdown();
    expect(wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="1"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(wrapper.findDropdown({ expandToViewport })!.find('[data-test-index="2"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  test('Trigger should have refer to the element using aria-label value and selected option', () => {
    const { wrapper } = renderSelect({ selectedOption: { label: 'First', value: '1' } });
    const label = wrapper
      .findTrigger()
      .getElement()
      .getAttribute('aria-labelledby')!
      .split(' ')
      .map(labelId => wrapper.getElement().querySelector(`#${labelId}`)!.textContent)
      .join(' ');
    expect(label).toBe('select First');
  });

  test('live announces footer text on initial dropdown render', () => {
    const { wrapper } = renderSelect({
      selectedOption: { label: 'First', value: '1' },
      statusType: 'error',
      errorText: 'Test error text',
    });
    expect(createWrapper().findLiveRegion()).toBeNull();

    wrapper.openDropdown();
    expectLiveRegionText('Test error text');
  });

  test('live announce footer text on dropdown toggle', () => {
    const { wrapper } = renderSelect({
      selectedOption: { label: 'First', value: '1' },
      statusType: 'error',
      errorText: 'Test error text',
    });
    expect(createWrapper().findLiveRegion()).toBeNull();

    wrapper.openDropdown();
    expectLiveRegionText('Test error text');

    wrapper.closeDropdown({ expandToViewport });
    expect(createWrapper().findLiveRegion()).toBeNull();

    wrapper.openDropdown();
    expectLiveRegionText('Test error text');
  });
});
