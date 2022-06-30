// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Select, { SelectProps } from '../../../lib/components/select';
import { expectNoAxeViolations } from '../../__a11y__/axe';

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

    await expectNoAxeViolations(container);
  });
});
