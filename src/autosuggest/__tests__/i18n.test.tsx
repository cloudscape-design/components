// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import '../../__a11y__/to-validate-a11y';
import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

import itemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  const originalModule = jest.requireActual('@cloudscape-design/component-toolkit/internal');

  //just mock the `warnOnce` export
  return {
    __esModule: true,
    ...originalModule,
    warnOnce: jest.fn(),
  };
});
beforeEach(() => {
  (warnOnce as any).mockClear();
});

const defaultOptions: AutosuggestProps.Options = [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }];
const defaultProps: AutosuggestProps = {
  value: '',
  onChange: () => {},
  options: defaultOptions,
};

function renderElement(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper, rerender };
}

describe('i18n provider', () => {
  test('supports providing recoveryText', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { recoveryText: 'Custom recovery text' } }}>
        <Autosuggest {...defaultProps} errorText="Error fetching items" statusType="error" onLoadItems={() => {}} />
      </TestI18nProvider>
    );
    wrapper.focus();
    expect(wrapper.findErrorRecoveryButton()!.getElement()).toHaveTextContent('Custom recovery text');
  });

  test('do not render recovery button if no recovery callback was provided', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { recoveryText: 'Custom recovery text' } }}>
        <Autosuggest {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.focus();
    expect(wrapper.findErrorRecoveryButton()).toBeNull();
  });

  test('supports providing errorIconAriaLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { errorIconAriaLabel: 'Custom error icon' } }}>
        <Autosuggest {...defaultProps} errorText="Error fetching items" statusType="error" />
      </TestI18nProvider>
    );
    wrapper.focus();
    const statusIcon = wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement();
    expect(statusIcon).toHaveAttribute('aria-label', 'Custom error icon');
  });

  test('supports providing enteredTextLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: 'Custom use value' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Custom use value');
  });

  test('supports providing selectedAriaLabel', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { selectedAriaLabel: 'Custom selected' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.focus();
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(
      wrapper
        .findDropdown()!
        .find('[data-test-index="1"]')!
        .findByClassName(itemStyles['screenreader-content'])!
        .getElement()
    ).toHaveTextContent('Custom selected');
  });

  const enteredTextLabelRequiredWarning = 'A value for enteredTextLabel must be provided.';

  test('should warn when enteredTextLabel is undefined and not using the i18n provider', () => {
    renderElement(<Autosuggest {...defaultProps} value="1" />);
    expect(warnOnce).toHaveBeenCalledWith('Autosuggest', enteredTextLabelRequiredWarning);
  });

  test('should warn when enteredTextLabel is undefined when using the i18n provider without enteredTextLabel value', () => {
    renderElement(
      <TestI18nProvider messages={{ autosuggest: {} }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    expect(warnOnce).toHaveBeenCalledWith('Autosuggest', enteredTextLabelRequiredWarning);
  });

  test('should warn when enteredTextLabel is undefined when using the i18n provider with empty enteredTextLabel value', () => {
    renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: '' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    expect(warnOnce).toHaveBeenCalledWith('Autosuggest', enteredTextLabelRequiredWarning);
  });

  test('should not warn when enteredTextLabel is undefined when using the i18n provider', () => {
    renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: 'Use' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    expect(warnOnce).not.toHaveBeenCalled();
  });
});
