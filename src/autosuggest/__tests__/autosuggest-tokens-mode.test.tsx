// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultOptions: AutosuggestProps.Options = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
];

function makeToken(value: string): AutosuggestProps.Token {
  return { value };
}

function StatefulAutosuggest(props: Partial<AutosuggestProps> & { initTokens?: AutosuggestProps.Token[] }) {
  const { initTokens = [], ...rest } = props;
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<ReadonlyArray<AutosuggestProps.Token>>(initTokens);

  return (
    <Autosuggest
      value={value}
      onChange={({ detail }) => {
        setValue(detail.value);
        if (detail.tokens !== undefined) {
          setTokens([...detail.tokens]);
        }
      }}
      tokens={tokens}
      options={defaultOptions.filter(o => !value || o.value!.includes(value))}
      {...rest}
    />
  );
}

function renderStateful(props?: Partial<AutosuggestProps> & { initTokens?: AutosuggestProps.Token[] }) {
  const { container } = render(<StatefulAutosuggest {...props} />);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper };
}

describe('Autosuggest tokens mode', () => {
  test('selecting a dropdown option adds it as a token and clears the input', () => {
    const { wrapper } = renderStateful();

    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });

  test('selecting a dropdown option fires onChange with the new token', () => {
    const onChange = jest.fn();
    const { container } = render(<Autosuggest value="us" onChange={onChange} tokens={[]} options={defaultOptions} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          tokens: [{ value: 'us-east-1' }],
        }),
      })
    );
  });

  test('selecting a dropdown option fires onChange with empty string to clear input', () => {
    const onChange = jest.fn();
    const { container } = render(<Autosuggest value="us" onChange={onChange} tokens={[]} options={defaultOptions} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ value: '' }) }));
  });

  test('existing tokens are preserved when a new one is selected', () => {
    const onChange = jest.fn();
    const existing = [makeToken('eu-west-1')];
    const { container } = render(
      <Autosuggest value="us" onChange={onChange} tokens={existing} options={defaultOptions} />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          tokens: [makeToken('eu-west-1'), { value: 'us-east-1' }],
        }),
      })
    );
  });

  test('entered-text label uses i18n catalog default (Add) in tokens mode when provided via I18nProvider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          autosuggest: {
            'i18nStrings.enteredTextLabel':
              '{isTokenMode, select, false {Use: "{value}"} true {Add "{value}"} other {}}',
          },
        }}
      >
        <StatefulAutosuggest />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.setInputValue('my-region'));
    const enteredOption = wrapper.findEnteredTextOption();
    expect(enteredOption!.getElement()).toHaveTextContent('Add "my-region"');
  });

  test('entered-text option has no text content when no enteredTextLabel prop or i18n provider is present', () => {
    const { wrapper } = renderStateful();
    act(() => wrapper.setInputValue('my-region'));
    expect(wrapper.findEnteredTextOption()?.getElement()).toHaveTextContent('');
  });

  test('explicit enteredTextLabel prop overrides the tokens-mode default', () => {
    const { wrapper } = renderStateful({ enteredTextLabel: v => `Use: "${v}"` });
    act(() => wrapper.setInputValue('my-region'));
    const enteredOption = wrapper.findEnteredTextOption();
    expect(enteredOption!.getElement()).toHaveTextContent('Use: "my-region"');
  });

  test('pressing Enter adds a token and clears the input', () => {
    const { wrapper } = renderStateful();
    act(() => wrapper.setInputValue('ap-southeast-1'));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });
});

describe('Autosuggest tokens mode — test-utils selectors', () => {
  test('findTokenTrigger returns the token row container when tokens prop is provided', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1')] });
    expect(wrapper.findTokenTrigger()).not.toBeNull();
  });

  test('findTokenTrigger returns null when tokens prop is absent', () => {
    const { container } = render(<Autosuggest value="" onChange={() => undefined} options={defaultOptions} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    expect(wrapper.findTokenTrigger()).toBeNull();
  });

  test('findInlineTokens returns all visible tokens', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1'), makeToken('eu-west-1')] });
    expect(wrapper.findInlineTokens()).toHaveLength(2);
  });

  test('findInlineTokens returns empty array when no tokens', () => {
    const { wrapper } = renderStateful({ initTokens: [] });
    expect(wrapper.findInlineTokens()).toHaveLength(0);
  });

  test('findInlineToken returns the token at a 1-based index', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1'), makeToken('eu-west-1')] });
    expect(wrapper.findInlineToken(1)!.getElement()).toHaveTextContent('us-east-1');
    expect(wrapper.findInlineToken(2)!.getElement()).toHaveTextContent('eu-west-1');
  });

  test('findInlineToken returns null for an out-of-range index', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1')] });
    expect(wrapper.findInlineToken(5)).toBeNull();
  });

  test('findOverflowPill returns null when all tokens are visible', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1')] });
    expect(wrapper.findOverflowPill()).toBeNull();
  });

  test('findOverflowPanel returns null when the overflow panel is not open', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1')] });
    expect(wrapper.findOverflowPanel()).toBeNull();
  });
});

describe('Autosuggest tokens mode — role=group', () => {
  test('root element has role=group in tokens mode', () => {
    const { wrapper } = renderStateful({ initTokens: [makeToken('us-east-1')] });
    expect(wrapper.getElement().getAttribute('role')).toBe('group');
  });

  test('root element does not have role=group in default mode', () => {
    const { container } = render(<Autosuggest value="" onChange={() => undefined} options={defaultOptions} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    expect(wrapper.getElement().getAttribute('role')).not.toBe('group');
  });

  test('group has aria-label from ariaLabel prop', () => {
    const { wrapper } = renderStateful({ initTokens: [], ariaLabel: 'Region selector' });
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Region selector');
  });
});

describe('Autosuggest tokens mode — a11y: tab order', () => {
  test('first visible token dismiss button has tabIndex=0 (is in Tab sequence)', () => {
    const { container } = render(<StatefulAutosuggest initTokens={[makeToken('us-east-1'), makeToken('eu-west-1')]} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    const firstBtn = wrapper.getElement().querySelector<HTMLButtonElement>('[data-token-item] button');
    expect(firstBtn!.tabIndex).toBe(0);
  });

  test('non-first token dismiss buttons have tabIndex=-1', () => {
    const { container } = render(<StatefulAutosuggest initTokens={[makeToken('us-east-1'), makeToken('eu-west-1')]} />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    const allBtns = Array.from(wrapper.getElement().querySelectorAll<HTMLButtonElement>('[data-token-item] button'));
    expect(allBtns[1].tabIndex).toBe(-1);
  });

  test('tokenDismissLabel i18n prop sets dismiss button aria-label', () => {
    const { container } = render(
      <StatefulAutosuggest
        initTokens={[makeToken('us-east-1')]}
        i18nStrings={{ tokenDismissLabel: (v: string) => `Remove region ${v}` }}
      />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    const dismissBtn = wrapper.findInlineToken(1)!.findDismiss()!.getElement();
    expect(dismissBtn).toHaveAttribute('aria-label', 'Remove region us-east-1');
  });

  test('no tokens: input is the only Tab stop', () => {
    const { wrapper } = renderStateful({ initTokens: [] });
    const allTabStops = Array.from(
      wrapper.getElement().querySelectorAll<HTMLElement>('[tabindex="0"], input:not([tabindex="-1"])')
    );
    const tagNames = allTabStops.map(el => el.tagName.toLowerCase());
    expect(tagNames.every(t => t === 'input')).toBe(true);
  });
});

describe('Autosuggest tokens mode — tokenInsertedAriaLabel announcement', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('live region is present in token mode', () => {
    renderStateful();
    expect(document.querySelector('[aria-live="assertive"]')).not.toBeNull();
  });

  test('custom tokenInsertedAriaLabel prop is used for the announcement text', () => {
    const { wrapper } = renderStateful({
      i18nStrings: { tokenInsertedAriaLabel: (v: string) => `Inserted: ${v}` },
    });

    act(() => wrapper.setInputValue('us-east-1'));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
    act(() => {
      jest.runAllTimers();
    });

    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion?.textContent).toContain('Inserted: us-east-1');
  });

  test('announcement text falls back to the token label when no tokenInsertedAriaLabel prop or i18n provider is present', () => {
    const { wrapper } = renderStateful();

    act(() => wrapper.setInputValue('eu-west-1'));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
    act(() => {
      jest.runAllTimers();
    });

    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion?.textContent).toContain('eu-west-1');
  });
});
