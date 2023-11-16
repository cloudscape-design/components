// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import '../../__a11y__/to-validate-a11y';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';
import itemStyles from '../../../lib/components/internal/components/selectable-item/styles.selectors.js';

const defaultOptions: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  { label: 'Third', value: '3', lang: 'es' },
  { label: 'Fourth', value: '4' },
];

const defaultProps = {
  options: defaultOptions,
  selectedOptions: [],
  onChange: () => {},
};

function renderElement(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findMultiselect()!;
  return { container, wrapper, rerender };
}
describe('i18n provider', () => {
  test('supports providing deselectAriaLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ multiselect: { deselectAriaLabel: 'Custom deselect {option__label}' } }}>
        <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} />
      </TestI18nProvider>
    );
    expect(wrapper.findToken(1)!.findDismiss().getElement()).toHaveAttribute('aria-label', 'Custom deselect First');
  });

  test('utilises recoveryText from Select messages', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { recoveryText: 'Custom recovery text' } }}>
        <Multiselect {...defaultProps} onLoadItems={() => {}} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    expect(wrapper.findErrorRecoveryButton()!.getElement()).toHaveTextContent('Custom recovery text');
  });

  test('do not render recovery button if no recovery callback was provided', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { recoveryText: 'Custom recovery text' } }}>
        <Multiselect {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.openDropdown();
    expect(wrapper.findErrorRecoveryButton()).toBeNull();
  });

  test('utilises errorIconAriaLabel from Select messages', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { errorIconAriaLabel: 'Custom error icon' } }}>
        <Multiselect {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );

    wrapper.openDropdown();
    const statusIcon = wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement();
    expect(statusIcon).toHaveAttribute('aria-label', 'Custom error icon');
  });

  test('utilises selectedAriaLabel from Select messages', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ select: { selectedAriaLabel: 'Custom selected' } }}>
        <Multiselect {...defaultProps} selectedOptions={[{ label: 'First', value: '1' }]} />
      </TestI18nProvider>
    );

    wrapper.openDropdown();
    const selectedOption = wrapper.findDropdown()!.find('[data-test-index="1"]');
    expect(selectedOption!.findByClassName(itemStyles['screenreader-content'])!.getElement()).toHaveTextContent(
      'Custom selected First'
    );
  });
});
