// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

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

  test('should not show entered-text option when enteredTextLabel is undefined and not using the i18n provider', () => {
    const { wrapper } = renderElement(<Autosuggest {...defaultProps} value="1" />);
    wrapper.setInputValue('test');
    expect(wrapper.findEnteredTextOption()?.getElement()).toHaveTextContent('');
  });

  test('should not show entered-text option when enteredTextLabel is undefined when using the i18n provider without enteredTextLabel value', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: {} }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('test');
    expect(wrapper.findEnteredTextOption()?.getElement()).toHaveTextContent('');
  });

  test('should not show entered-text option when enteredTextLabel is undefined when using the i18n provider with empty enteredTextLabel value', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: '' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('test');
    expect(wrapper.findEnteredTextOption()?.getElement()).toHaveTextContent('');
  });

  test('should show entered-text option when enteredTextLabel is provided via i18n provider', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: 'Use' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('test');
    expect(wrapper.findEnteredTextOption()?.getElement()).toHaveTextContent('Use');
  });

  test('supports providing enteredTextLabel via i18n provider in tokens mode', () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: 'Custom add value' } }}>
        <Autosuggest {...defaultProps} value="1" tokens={[]} />
      </TestI18nProvider>
    );
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Custom add value');
  });

  test('should not warn when tokens mode and enteredTextLabel is provided via i18n provider', () => {
    renderElement(
      <TestI18nProvider messages={{ autosuggest: { enteredTextLabel: 'Add' } }}>
        <Autosuggest {...defaultProps} value="1" tokens={[]} />
      </TestI18nProvider>
    );
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test("supports providing enteredTextLabel via i18n provider dotted key 'i18nStrings.enteredTextLabel'", () => {
    const { wrapper } = renderElement(
      <TestI18nProvider messages={{ autosuggest: { 'i18nStrings.enteredTextLabel': 'Dotted key value' } }}>
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Dotted key value');
  });

  test("dotted key 'i18nStrings.enteredTextLabel' wins over flat 'enteredTextLabel' in provider", () => {
    const { wrapper } = renderElement(
      <TestI18nProvider
        messages={{ autosuggest: { enteredTextLabel: 'Flat key', 'i18nStrings.enteredTextLabel': 'Dotted key' } }}
      >
        <Autosuggest {...defaultProps} value="1" />
      </TestI18nProvider>
    );
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Dotted key');
  });

  test("should not warn when 'i18nStrings.enteredTextLabel' dotted key is provided via i18n provider", () => {
    renderElement(
      <TestI18nProvider messages={{ autosuggest: { 'i18nStrings.enteredTextLabel': 'Add' } }}>
        <Autosuggest {...defaultProps} value="1" tokens={[]} />
      </TestI18nProvider>
    );
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('i18nStrings.enteredTextLabel direct prop is used in tokens mode', () => {
    function TokensAutosuggest(props: Partial<AutosuggestProps>) {
      const [value, setValue] = React.useState('1');
      return (
        <Autosuggest
          {...defaultProps}
          {...props}
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          tokens={[]}
          i18nStrings={{ enteredTextLabel: v => `Add tag "${v}"` }}
        />
      );
    }
    const { container } = render(<TokensAutosuggest />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Add tag "S"');
  });

  test('i18nStrings.enteredTextLabel direct prop is used in default mode', () => {
    function DefaultAutosuggest() {
      const [value, setValue] = React.useState('1');
      return (
        <Autosuggest
          {...defaultProps}
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          i18nStrings={{ enteredTextLabel: v => `Search for "${v}"` }}
        />
      );
    }
    const { container } = render(<DefaultAutosuggest />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Search for "S"');
  });

  test('i18nStrings.enteredTextLabel takes priority over deprecated enteredTextLabel prop in tokens mode', () => {
    function OverrideAutosuggest() {
      const [value, setValue] = React.useState('1');
      return (
        <Autosuggest
          {...defaultProps}
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          tokens={[]}
          enteredTextLabel={v => `Use "${v}"`}
          i18nStrings={{ enteredTextLabel: v => `Add "${v}"` }}
        />
      );
    }
    const { container } = render(<OverrideAutosuggest />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    wrapper.setInputValue('S');
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Add "S"');
  });

  test('supports providing i18nStrings.tokenInsertedAriaLabel via i18n provider dotted key', () => {
    jest.useFakeTimers();
    function TokensAutosuggest() {
      const [value, setValue] = React.useState('');
      const [tokens, setTokens] = React.useState<AutosuggestProps.Token[]>([]);
      return (
        <TestI18nProvider
          messages={{ autosuggest: { 'i18nStrings.tokenInsertedAriaLabel': '{token__label} was inserted' } }}
        >
          <Autosuggest
            {...defaultProps}
            value={value}
            tokens={tokens}
            onChange={({ detail }) => {
              setValue(detail.value);
              if (detail.tokens !== undefined) {
                setTokens([...detail.tokens] as AutosuggestProps.Token[]);
              }
            }}
          />
        </TestI18nProvider>
      );
    }
    const { container } = render(<TokensAutosuggest />);
    const wrapper = createWrapper(container).findAutosuggest()!;

    wrapper.setInputValue('my-region');
    act(() => {
      wrapper.findNativeInput().keydown(KeyCode.enter);
    });
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();

    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion?.textContent).toContain('my-region was inserted');
  });

  test('i18nStrings.tokenInsertedAriaLabel direct prop takes effect in tokens mode', () => {
    jest.useFakeTimers();
    function TokensAutosuggest() {
      const [value, setValue] = React.useState('');
      const [tokens, setTokens] = React.useState<AutosuggestProps.Token[]>([]);
      return (
        <Autosuggest
          {...defaultProps}
          value={value}
          tokens={tokens}
          i18nStrings={{ tokenInsertedAriaLabel: (v: string) => `Added: ${v}` }}
          onChange={({ detail }) => {
            setValue(detail.value);
            if (detail.tokens !== undefined) {
              setTokens([...detail.tokens] as AutosuggestProps.Token[]);
            }
          }}
        />
      );
    }
    const { container } = render(<TokensAutosuggest />);
    const wrapper = createWrapper(container).findAutosuggest()!;

    wrapper.setInputValue('us-east-1');
    act(() => {
      wrapper.findNativeInput().keydown(KeyCode.enter);
    });
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();

    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion?.textContent).toContain('Added: us-east-1');
  });
});
