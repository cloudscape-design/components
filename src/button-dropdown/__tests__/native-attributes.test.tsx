// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('ButtonDropdown native attributes', () => {
  const items = [{ id: 'item1', text: 'Item 1' }];

  test('passes nativeButtonAttributes to the dropdown trigger button', () => {
    const { container } = render(
      <ButtonDropdown
        items={items}
        nativeButtonAttributes={{
          'data-testid': 'dropdown-trigger',
          'aria-controls': 'controlled-element',
        }}
      />
    );
    const wrapper = createWrapper(container).findButtonDropdown()!;
    const triggerButton = wrapper.findNativeButton().getElement();

    expect(triggerButton).toHaveAttribute('data-testid', 'dropdown-trigger');
    expect(triggerButton).toHaveAttribute('aria-controls', 'controlled-element');
  });

  test('passes nativeMainActionButtonAttributes to the main action button', () => {
    const { container } = render(
      <ButtonDropdown
        items={items}
        variant="primary"
        mainAction={{ text: 'Main action' }}
        nativeMainActionButtonAttributes={{
          'data-testid': 'main-action',
          'aria-controls': 'another-element',
        }}
      />
    );
    const wrapper = createWrapper(container).findButtonDropdown()!;
    const mainActionButton = wrapper.findMainAction()!.getElement();

    expect(mainActionButton).toHaveAttribute('data-testid', 'main-action');
    expect(mainActionButton).toHaveAttribute('aria-controls', 'another-element');
  });

  test('does not apply nativeMainActionButtonAttributes when no main action is present', () => {
    const { container } = render(
      <ButtonDropdown
        items={items}
        nativeMainActionButtonAttributes={{
          'data-testid': 'main-action',
        }}
      />
    );
    const wrapper = createWrapper(container).findButtonDropdown()!;

    expect(wrapper.findMainAction()).toBeNull();
    expect(container.querySelector('[data-testid="main-action"]')).toBeNull();
  });

  test('applies both nativeButtonAttributes and nativeMainActionButtonAttributes to respective buttons', () => {
    const { container } = render(
      <ButtonDropdown
        items={items}
        variant="primary"
        mainAction={{ text: 'Main action' }}
        nativeButtonAttributes={{
          'data-testid': 'dropdown-trigger',
        }}
        nativeMainActionButtonAttributes={{
          'data-testid': 'main-action',
        }}
      />
    );
    const wrapper = createWrapper(container).findButtonDropdown()!;

    expect(wrapper.findNativeButton().getElement()).toHaveAttribute('data-testid', 'dropdown-trigger');
    expect(wrapper.findMainAction()!.getElement()).toHaveAttribute('data-testid', 'main-action');
  });
});
