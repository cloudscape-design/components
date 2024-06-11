// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ButtonGroupProps } from '../../../lib/components/button-group/interfaces';
import ItemElement from '../../../lib/components/button-group/item-element';

describe('ItemElement', () => {
  const item: ButtonGroupProps.Item = {
    id: 'test-button',
    text: 'Test Button',
    iconName: 'add-plus',
    loading: false,
    loadingText: 'Loading...',
    disabled: false,
    actionPopoverText: 'Action Popover',
  };

  test('renders the button', () => {
    render(<ItemElement item={item} />);
    const button = screen.getByTestId('test-button');

    expect(button).toBeInTheDocument();
  });

  test('shows the tooltip on hover', () => {
    render(<ItemElement item={item} />);

    const button = screen.getByTestId('test-button');
    fireEvent.pointerEnter(button);

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('shows the action popover text on click', () => {
    const onItemClick = jest.fn();
    render(<ItemElement item={item} onItemClick={onItemClick} />);

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);

    expect(screen.getByText('Action Popover')).toBeInTheDocument();
    expect(onItemClick).toHaveBeenCalled();
  });

  test('shows the action popover text on click after pointer leaves', () => {
    const onItemClick = jest.fn();
    render(<ItemElement item={item} onItemClick={onItemClick} />);

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    fireEvent.pointerLeave(button);

    expect(screen.getByText('Action Popover')).toBeInTheDocument();
    expect(onItemClick).toHaveBeenCalled();
  });

  test('handles click event correctly', () => {
    const onItemClick = jest.fn();
    render(<ItemElement item={item} onItemClick={onItemClick} />);

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);

    expect(onItemClick).toHaveBeenCalled();
  });

  test('closes the popover when document pointerdown called', () => {
    render(<ItemElement item={item} />);

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    expect(screen.getByText('Action Popover')).toBeInTheDocument();

    fireEvent.pointerDown(document);
    expect(screen.queryByText('Action Popover')).not.toBeInTheDocument();
  });
});
