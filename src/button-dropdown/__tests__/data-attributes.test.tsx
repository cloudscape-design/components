// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ButtonDropdown from '../../../lib/components/button-dropdown';

describe('ButtonDropdown data attributes', () => {
  test('renders custom data attributes on items', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'edit',
            text: 'Edit',
            dataAttributes: {
              'analytics-action': 'edit-product',
              'item-key': 'product-123',
            },
          },
        ]}
      />
    );

    const item = getByText('Edit').closest('li');
    expect(item).toHaveAttribute('data-analytics-action', 'edit-product');
    expect(item).toHaveAttribute('data-item-key', 'product-123');
  });

  test('automatically prepends data- prefix', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'delete',
            text: 'Delete',
            dataAttributes: { 'custom-attr': 'value' },
          },
        ]}
      />
    );

    const item = getByText('Delete').closest('li');
    expect(item).toHaveAttribute('data-custom-attr', 'value');
  });

  test('excludes testid from dataAttributes', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'original-id',
            text: 'Action',
            dataAttributes: { testid: 'should-not-override' },
          },
        ]}
      />
    );

    const item = getByText('Action').closest('li');
    expect(item).toHaveAttribute('data-testid', 'original-id');
    expect(consoleSpy).toHaveBeenCalledWith(
      'ButtonDropdown: "testid" key is reserved and cannot be overridden via dataAttributes'
    );
    
    consoleSpy.mockRestore();
  });

  test('handles undefined values', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'action',
            text: 'Action',
            dataAttributes: {
              defined: 'value',
              undefined: undefined,
            },
          },
        ]}
      />
    );

    const item = getByText('Action').closest('li');
    expect(item).toHaveAttribute('data-defined', 'value');
    expect(item).not.toHaveAttribute('data-undefined');
  });

  test('works with multiple items', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'edit',
            text: 'Edit',
            dataAttributes: { action: 'edit' },
          },
          {
            id: 'delete',
            text: 'Delete',
            dataAttributes: { action: 'delete' },
          },
        ]}
      />
    );

    expect(getByText('Edit').closest('li')).toHaveAttribute('data-action', 'edit');
    expect(getByText('Delete').closest('li')).toHaveAttribute('data-action', 'delete');
  });

  test('works with disabled items', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            id: 'disabled',
            text: 'Disabled',
            disabled: true,
            dataAttributes: { state: 'disabled' },
          },
        ]}
      />
    );

    const item = getByText('Disabled').closest('li');
    expect(item).toHaveAttribute('data-state', 'disabled');
  });

  test('works with checkbox items', () => {
    const { getByText } = render(
      <ButtonDropdown
        items={[
          {
            itemType: 'checkbox',
            id: 'checkbox-item',
            text: 'Checkbox',
            checked: true,
            dataAttributes: { 'checkbox-id': 'cb-1' },
          },
        ]}
      />
    );

    const item = getByText('Checkbox').closest('li');
    expect(item).toHaveAttribute('data-checkbox-id', 'cb-1');
  });
});
