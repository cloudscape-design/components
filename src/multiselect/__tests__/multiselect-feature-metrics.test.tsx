// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import * as baseComponentHooks from '../../../lib/components/internal/hooks/use-base-component';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';

const useBaseComponentSpy = jest.spyOn(baseComponentHooks, 'default');

const defaultProps: MultiselectProps = {
  selectedOptions: [],
  onChange: () => {},
  options: [{ value: '1', label: 'One' }],
  ariaLabel: 'multiselect',
};

beforeEach(() => useBaseComponentSpy.mockClear());

test('reports dropdown-customization feature usage in metadata', () => {
  render(
    <Multiselect
      {...defaultProps}
      renderDropdownHeader={() => 'header'}
      renderDropdownFooter={() => 'footer'}
      dropdownRole="dialog"
      dropdownAriaDescribedby="desc"
    />
  );

  expect(useBaseComponentSpy).toHaveBeenCalledWith('Multiselect', {
    props: expect.objectContaining({ dropdownRole: 'dialog' }),
    metadata: expect.objectContaining({
      hasDropdownHeader: true,
      hasDropdownFooter: true,
      hasDropdownAriaDescribedby: true,
    }),
  });
});

test('reports no dropdown-customization usage by default', () => {
  render(<Multiselect {...defaultProps} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith('Multiselect', {
    props: expect.anything(),
    metadata: expect.objectContaining({
      hasDropdownHeader: false,
      hasDropdownFooter: false,
      hasDropdownAriaDescribedby: false,
    }),
  });
});
