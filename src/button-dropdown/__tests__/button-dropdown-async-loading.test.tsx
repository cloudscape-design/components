// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Cut' },
  { id: 'i2', text: 'Copy' },
  { id: 'i3', text: 'Paste' },
];

function renderDropdown(props: Partial<ButtonDropdownProps> = {}) {
  const result = render(
    <ButtonDropdown items={items} ariaLabel="Actions" {...props}>
      Actions
    </ButtonDropdown>
  );
  const wrapper = createWrapper(result.container).findButtonDropdown()!;
  return { ...result, wrapper };
}

beforeEach(() => {
  jest.mocked(warnOnce).mockClear();
});

describe('ButtonDropdown async loading', () => {
  test('fires onLoadItems with the initial (empty) filtering text when the dropdown opens', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('fires onLoadItems after a delay when the filtering input changes', async () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    onLoadItems.mockClear();

    wrapper.findFilteringInput()!.setInputValue('test');
    expect(wrapper.findFilteringInput()!.findNativeInput().getElement()).toHaveValue('test');

    await waitFor(() =>
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'test', firstPage: true, samePage: false })
    );
  });

  test('fires onLoadItems to retry a failed request when the recovery button is clicked', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      asyncLoadingProps: {
        statusType: 'error',
        errorText: () => 'Error fetching items',
        recoveryText: 'Retry',
      },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    onLoadItems.mockClear();

    const recoveryButton = wrapper.findErrorRecoveryButton()!;
    expect(recoveryButton).not.toBeNull();
    recoveryButton.click();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: true });
  });

  test('warns if recoveryText is provided without onLoadItems', () => {
    renderDropdown({
      asyncLoadingProps: {
        statusType: 'error',
        errorText: () => 'Error',
        recoveryText: 'Retry',
      },
    });
    expect(warnOnce).toHaveBeenCalledWith(
      'ButtonDropdown',
      '`onLoadItems` must be provided for `recoveryText` to be displayed.'
    );
  });

  test('does not apply client-side filtering when filteringType is "manual"', () => {
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    // All provided items remain visible regardless of the filtering value in manual mode.
    wrapper.findFilteringInput()!.setInputValue('zzz');
    expect(wrapper.findItems()).toHaveLength(items.length);
  });
});

describe('ButtonDropdown status display', () => {
  test.each([
    ['loading', true],
    ['error', true],
    ['finished', false],
  ])('displays %s status text as %s footer', (statusType, isSticky) => {
    const statusText =
      statusType === 'loading'
        ? { loadingText: () => 'Test loading text' }
        : { [`${statusType}Text`]: () => `Test ${statusType} text` };
    const expectedText = statusType === 'loading' ? 'Test loading text' : `Test ${statusType} text`;

    const { wrapper } = renderDropdown({
      asyncLoadingProps: {
        statusType: statusType as ButtonDropdownProps.AsyncLoadingStatusType,
        ...statusText,
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();

    const statusIndicator = wrapper.findStatusIndicator();
    expect(statusIndicator).not.toBeNull();
    expect(statusIndicator!.getElement()).toHaveTextContent(expectedText);
    void isSticky;
  });

  test('displays the empty state when there are no items', () => {
    const { wrapper } = renderDropdown({
      items: [],
      asyncLoadingProps: {
        empty: () => 'No items available',
      },
    });
    wrapper.openDropdown();
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('No items available');
  });
});
