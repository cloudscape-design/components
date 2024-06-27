// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroupProps } from '../../../lib/components/button-group/interfaces';
import MenuDropdownItem from '../../../lib/components/button-group/menu-dropdown-item';

describe('MenuDropdownItem', () => {
  const item: ButtonGroupProps.MenuDropdown = {
    type: 'menu-dropdown',
    id: 'more-buttons',
    text: 'More buttons',
    items: [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
      {
        id: '4',
        text: 'Group',
        items: [
          { id: '5', text: 'Item 5' },
          { id: '6', text: 'Item 6' },
        ],
      },
    ],
  };

  test('renders the button', () => {
    const { container } = render(<MenuDropdownItem item={item} />);

    expect(container).toBeInTheDocument();
  });
});
