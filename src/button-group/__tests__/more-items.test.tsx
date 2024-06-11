// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ButtonGroupProps } from '../../../lib/components/button-group/interfaces';
import MoreItems from '../../../lib/components/button-group/more-items';

describe('MoreItems', () => {
  const items: ButtonGroupProps.ItemOrGroup[] = [
    { id: '1', text: 'Item 1', actionPopoverText: 'Action 1' },
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
  ];

  test('renders the button', () => {
    const { container } = render(<MoreItems items={items} />);

    expect(container).toBeInTheDocument();
  });

  test('shows and closes action tooltip on item click', () => {
    const { container } = render(<MoreItems items={items} />);

    const button = container.querySelector('[type="button"]')!;
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Item 1'));

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    fireEvent.pointerDown(document);
    expect(screen.queryByText('Action 1')).not.toBeInTheDocument();
  });
});
