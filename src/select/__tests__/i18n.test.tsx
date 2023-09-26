// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Select, { SelectProps } from '../../../lib/components/select';
import '../../__a11y__/to-validate-a11y';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import itemStyles from '../../../lib/components/internal/components/selectable-item/styles.selectors.js';

const defaultOptions: SelectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  {
    label: 'Group',
    options: [
      {
        label: 'Third',
        value: '3',
        lang: 'de',
      },
      {
        label: 'Forth',
        value: '4',
      },
    ],
  },
];

const defaultProps = {
  options: defaultOptions,
  selectedOption: null,
  onChange: () => {},
};

function renderElement(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findSelect()!;
  return { container, wrapper, rerender };
}

describe('i18n provider', () => {
  test('supports providing recoveryText', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { recoveryText: 'Custom recovery text' } }}>
        <Select {...defaultProps} errorText="Error fetching items" statusType="error" onLoadItems={() => {}} />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    expect(wrapper.findErrorRecoveryButton()!.getElement()).toHaveTextContent('Custom recovery text');
  });

  test('do not render recovery button if no recovery callback was provided', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { recoveryText: 'Custom recovery text' } }}>
        <Select {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    expect(wrapper.findErrorRecoveryButton()).toBeNull();
  });

  test('supports providing errorIconAriaLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { errorIconAriaLabel: 'Custom error icon' } }}>
        <Select {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    const statusIcon = wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement();
    expect(statusIcon).toHaveAttribute('aria-label', 'Custom error icon');
  });

  test('supports providing selectedAriaLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { selectedAriaLabel: 'Custom selected' } }}>
        <Select {...defaultProps} selectedOption={{ label: 'First', value: '1' }} />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    const selectedOption = wrapper.findDropdown()!.find('[data-test-index="1"]');
    expect(selectedOption!.findByClassName(itemStyles['screenreader-content'])!.getElement()).toHaveTextContent(
      'Custom selected'
    );
  });
});
