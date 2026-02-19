// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('ButtonDropdown data attributes', () => {
  test('renders custom data attributes on items', () => {
    const { container } = render(
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

    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    const item = wrapper.findItemById('edit')!.getElement();

    expect(item).toHaveAttribute('data-analytics-action', 'edit-product');
    expect(item).toHaveAttribute('data-item-key', 'product-123');
  });

  test('does not duplicate data- prefix when already present', () => {
    const { container } = render(
      <ButtonDropdown
        items={[
          {
            id: 'action',
            text: 'Action',
            dataAttributes: { 'data-custom': 'value' },
          },
        ]}
      />
    );

    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    const item = wrapper.findItemById('action')!.getElement();

    expect(item).toHaveAttribute('data-custom', 'value');
    expect(item).not.toHaveAttribute('data-data-custom');
  });

  test('excludes testid from dataAttributes', () => {
    const { container } = render(
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

    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    const item = wrapper.findItemById('original-id')!.getElement();

    expect(item).toHaveAttribute('data-testid', 'original-id');
  });

  test('handles undefined values', () => {
    const dataAttrs: Record<string, string | undefined> = {
      defined: 'value',
      undefined: undefined,
    };

    const { container } = render(
      <ButtonDropdown
        items={[
          {
            id: 'action',
            text: 'Action',
            dataAttributes: dataAttrs as Record<string, string>,
          },
        ]}
      />
    );

    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    const item = wrapper.findItemById('action')!.getElement();

    expect(item).toHaveAttribute('data-defined', 'value');
    expect(item).not.toHaveAttribute('data-undefined');
  });

  test('works with multiple items, disabled items, and checkbox items', () => {
    const { container } = render(
      <ButtonDropdown
        items={[
          {
            id: 'edit',
            text: 'Edit',
            dataAttributes: { action: 'edit' },
          },
          {
            id: 'disabled',
            text: 'Disabled',
            disabled: true,
            dataAttributes: { state: 'disabled' },
          },
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

    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();

    expect(wrapper.findItemById('edit')!.getElement()).toHaveAttribute('data-action', 'edit');
    expect(wrapper.findItemById('disabled')!.getElement()).toHaveAttribute('data-state', 'disabled');
    expect(wrapper.findItemById('checkbox-item')!.getElement()).toHaveAttribute('data-checkbox-id', 'cb-1');
  });
});

  test('renders custom data attributes on mainAction', () => {
    const { container } = render(
      <ButtonDropdown
        items={[{ id: 'item1', text: 'Item 1' }]}
        mainAction={{
          text: 'Main Action',
          dataAttributes: {
            'analytics-action': 'main-action',
            'button-type': 'primary',
          },
        }}
      >
        Actions
      </ButtonDropdown>
    );

    const wrapper = createWrapper(container).findButtonDropdown()!;
    const mainActionButton = wrapper.findMainAction()!.getElement();

    expect(mainActionButton).toHaveAttribute('data-analytics-action', 'main-action');
    expect(mainActionButton).toHaveAttribute('data-button-type', 'primary');
  });

  test('mainAction does not duplicate data- prefix when already present', () => {
    const { container } = render(
      <ButtonDropdown
        items={[{ id: 'item1', text: 'Item 1' }]}
        mainAction={{
          text: 'Main Action',
          dataAttributes: { 'data-custom': 'value' },
        }}
      >
        Actions
      </ButtonDropdown>
    );

    const wrapper = createWrapper(container).findButtonDropdown()!;
    const mainActionButton = wrapper.findMainAction()!.getElement();

    expect(mainActionButton).toHaveAttribute('data-custom', 'value');
    expect(mainActionButton).not.toHaveAttribute('data-data-custom');
  });

  test('mainAction excludes testid from dataAttributes', () => {
    const { container } = render(
      <ButtonDropdown
        items={[{ id: 'item1', text: 'Item 1' }]}
        mainAction={{
          text: 'Main Action',
          dataAttributes: { testid: 'should-not-override' },
        }}
      >
        Actions
      </ButtonDropdown>
    );

    const wrapper = createWrapper(container).findButtonDropdown()!;
    const mainActionButton = wrapper.findMainAction()!.getElement();

    // Should not have testid attribute from dataAttributes
    expect(mainActionButton).not.toHaveAttribute('data-testid', 'should-not-override');
  });
