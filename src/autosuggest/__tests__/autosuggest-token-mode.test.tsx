// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';
import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import FormField from '../../../lib/components/form-field';
import I18nProvider from '../../../lib/components/i18n';
import messages from '../../../lib/components/i18n/messages/all.en';
import createWrapper from '../../../lib/components/test-utils/dom';

let mockVisibleCount: number | null = null;
jest.mock('../../../lib/components/internal/components/autosuggest-input/use-token-overflow', () => ({
  useTokenOverflow: ({ tokenCount }: { tokenCount: number }) => ({
    containerRef: () => {},
    visibleCount: mockVisibleCount === null ? tokenCount : Math.min(mockVisibleCount, tokenCount),
  }),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  getIsRtl: jest.fn().mockReturnValue(false),
}));

beforeEach(() => {
  mockVisibleCount = null;
  jest.mocked(getIsRtl).mockReturnValue(false);
});

const options: AutosuggestProps.Options = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
];

const toTokens = (...values: string[]) => values.map(value => ({ value }));

type StatefulProps = Partial<AutosuggestProps> & { initialTokens?: AutosuggestProps.Token[]; initialValue?: string };

function StatefulAutosuggest({ initialTokens = [], initialValue = '', onChange, ...props }: StatefulProps) {
  const [value, setValue] = useState(initialValue);
  const [tokens, setTokens] = useState<ReadonlyArray<AutosuggestProps.Token>>(initialTokens);
  return (
    <Autosuggest
      value={value}
      tokens={tokens}
      options={options}
      enteredTextLabel={v => `Add "${v}"`}
      ariaLabel="Regions"
      {...props}
      onChange={event => {
        setValue(event.detail.value);
        setTokens(event.detail.tokens ?? []);
        onChange?.(event);
      }}
    />
  );
}

function renderTokens(props: StatefulProps = {}) {
  const onChange = jest.fn();
  const { container } = render(<StatefulAutosuggest onChange={onChange} {...props} />);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper, onChange };
}

function visibleLabels(wrapper: ReturnType<typeof renderTokens>['wrapper']) {
  return wrapper.findVisibleTokens().map(token => token.getElement().textContent);
}

function dismissButton(wrapper: ReturnType<typeof renderTokens>['wrapper'], index: number) {
  return wrapper.findVisibleToken(index)!.findDismiss()!.getElement();
}

function lastTokens(onChange: jest.Mock) {
  return onChange.mock.calls[onChange.mock.calls.length - 1][0].detail.tokens;
}

describe('rendering', () => {
  test('renders each token inline', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('us-east-1', 'eu-west-1') });
    expect(visibleLabels(wrapper)).toEqual(['us-east-1', 'eu-west-1']);
    expect(wrapper.findVisibleToken(2)!.getElement()).toHaveTextContent('eu-west-1');
    expect(wrapper.findVisibleToken(3)).toBeNull();
  });

  test('renders the token icon', () => {
    const { wrapper } = renderTokens({ initialTokens: [{ value: 'a', icon: <svg data-testid="token-icon" /> }] });
    expect(wrapper.findVisibleToken(1)!.find('[data-testid="token-icon"]')).not.toBeNull();
  });

  test('renders no tokens and no group semantics without the tokens property', () => {
    const { container } = render(<Autosuggest value="" onChange={() => {}} options={options} ariaLabel="Regions" />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    expect(wrapper.findVisibleTokens()).toEqual([]);
    expect(wrapper.findOverflowTrigger()).toBeNull();
    expect(wrapper.getElement()).not.toHaveAttribute('role');
  });

  test('does not include tokens in the change detail without the tokens property', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Autosuggest value="" onChange={onChange} options={options} enteredTextLabel={v => `Use "${v}"`} />
    );
    createWrapper(container).findAutosuggest()!.setInputValue('x');
    expect(onChange).toHaveBeenCalledTimes(1);
    const { detail } = onChange.mock.calls[0][0];
    expect(detail.value).toBe('x');
    expect(detail).not.toHaveProperty('tokens');
  });

  test('groups tokens and input under the aria-label', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a') });
    expect(wrapper.getElement()).toHaveAttribute('role', 'group');
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Regions');
  });

  test('labels the group by the form field label', () => {
    const { container } = render(
      <FormField label="Regions">
        <StatefulAutosuggest ariaLabel={undefined} initialTokens={toTokens('a')} />
      </FormField>
    );
    const wrapper = createWrapper(container);
    const group = wrapper.findAutosuggest()!.getElement();
    expect(group).not.toHaveAttribute('aria-label');
    expect(document.getElementById(group.getAttribute('aria-labelledby')!)).toHaveTextContent('Regions');
  });

  test('marks the input as invalid when the field is invalid', () => {
    const { wrapper } = renderTokens({ invalid: true });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('marks the input as invalid from the form field context', () => {
    const { container } = render(
      <FormField label="Regions" errorText="Required">
        <StatefulAutosuggest />
      </FormField>
    );
    const input = createWrapper(container).findAutosuggest()!.findNativeInput().getElement();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('does not mark a valid input as invalid', () => {
    const { wrapper } = renderTokens();
    expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-invalid');
  });

  test('exposes the position of visible tokens in the whole set', () => {
    mockVisibleCount = 2;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    const items = wrapper.findVisibleTokens().map(token => token.getElement().parentElement!);
    expect(items.map(item => item.getAttribute('aria-posinset'))).toEqual(['2', '3']);
    expect(items.map(item => item.getAttribute('aria-setsize'))).toEqual(['3', '3']);
  });
});

describe('adding tokens', () => {
  test('Enter adds the trimmed input value as a token and clears the input', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a') });
    wrapper.setInputValue('  b  ');
    wrapper.findNativeInput().keydown(KeyCode.escape);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { value: '', tokens: toTokens('a', 'b') } })
    );
    expect(visibleLabels(wrapper)).toEqual(['a', 'b']);
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });

  test('Enter on the highlighted entered-text option adds the token', () => {
    const { wrapper } = renderTokens();
    wrapper.setInputValue('ap-south-1');
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(visibleLabels(wrapper)).toEqual(['ap-south-1']);
  });

  test('selecting a suggestion adds it as a token, keeping existing ones', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('eu-west-1') });
    wrapper.setInputValue('us');
    wrapper.selectSuggestionByValue('us-east-1');
    expect(lastTokens(onChange)).toEqual(toTokens('eu-west-1', 'us-east-1'));
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });

  test('selecting a suggestion keeps its value exactly as declared', () => {
    const { wrapper, onChange } = renderTokens({ options: [{ value: ' code ' }] });
    wrapper.setInputValue('code');
    wrapper.selectSuggestionByValue(' code ');
    expect(lastTokens(onChange)).toEqual(toTokens(' code '));
  });

  test('the entered-text option adds the trimmed input value', () => {
    const { wrapper, onChange } = renderTokens();
    wrapper.setInputValue('  ap-south-1  ');
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(lastTokens(onChange)).toEqual(toTokens('ap-south-1'));
  });

  test('allows duplicate tokens', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a'), initialValue: 'a' });
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(visibleLabels(wrapper)).toEqual(['a', 'a']);
  });

  test.each([
    ['whitespace-only value', { initialValue: '   ' }],
    ['read-only', { initialValue: 'a', readOnly: true }],
    ['disabled', { initialValue: 'a', disabled: true }],
  ])('Enter does not add a token for %s', (_, props) => {
    const { wrapper, onChange } = renderTokens(props);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Enter during IME composition does not add a token', () => {
    const { wrapper, onChange } = renderTokens({ initialValue: 'a' });
    const input = wrapper.findNativeInput().getElement();
    act(() => {
      input.dispatchEvent(new Event('compositionstart', { bubbles: true }));
    });
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('announcement', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const announcement = () => {
      jest.runAllTimers();
      return document.querySelector('[aria-live="assertive"]')!.textContent;
    };

    test('announces a token added with Enter', () => {
      const { wrapper } = renderTokens({
        initialValue: 'a',
        i18nStrings: { tokenInsertedAriaLabel: value => `${value} added` },
      });
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(announcement()).toBe('a added');
    });

    test('announces a token added from the suggestions', () => {
      const { wrapper } = renderTokens({ i18nStrings: { tokenInsertedAriaLabel: value => `${value} added` } });
      wrapper.setInputValue('us');
      wrapper.selectSuggestionByValue('us-east-1');
      expect(announcement()).toBe('us-east-1 added');
    });

    test('announces the token value when no label is provided', () => {
      const { wrapper } = renderTokens({ initialValue: 'a' });
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(announcement()).toBe('a');
    });

    test('uses the provider message', () => {
      const { container } = render(
        <I18nProvider messages={[messages]} locale="en">
          <StatefulAutosuggest initialValue="a" />
        </I18nProvider>
      );
      createWrapper(container).findAutosuggest()!.findNativeInput().keydown(KeyCode.enter);
      expect(announcement()).toBe('a inserted');
    });
  });

  test('does not announce filtering results', () => {
    const { wrapper } = renderTokens({ filteringResultsText: count => `${count} matches` });
    wrapper.setInputValue('us');
    expect(wrapper.findDropdown().findFooterRegion()).toBeNull();
  });
});

describe('removing tokens', () => {
  test('dismiss button removes the token', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    act(() => dismissButton(wrapper, 2).click());
    expect(lastTokens(onChange)).toEqual(toTokens('a', 'c'));
  });

  test.each([KeyCode.backspace, 46])('key %s on a token removes it', keyCode => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    createWrapper(dismissButton(wrapper, 1)).focus();
    createWrapper(dismissButton(wrapper, 1)).keydown({ keyCode });
    expect(visibleLabels(wrapper)).toEqual(['b']);
  });

  test.each([{ readOnly: true }, { disabled: true }])('tokens cannot be removed when %o', props => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a'), ...props });
    act(() => dismissButton(wrapper, 1).click());
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.backspace);
    expect(onChange).not.toHaveBeenCalled();
    expect(dismissButton(wrapper, 1)).toHaveAttribute('aria-disabled', 'true');
  });

  test('focus moves to the next token after removing a middle token', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    act(() => dismissButton(wrapper, 2).click());
    expect(document.activeElement).toBe(dismissButton(wrapper, 2));
    expect(wrapper.findVisibleToken(2)!.getElement()).toHaveTextContent('c');
  });

  test('focus moves to the previous token after removing the last token', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    act(() => dismissButton(wrapper, 2).click());
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
  });

  test('focus moves to the input without opening suggestions after removing the only token', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a') });
    act(() => dismissButton(wrapper, 1).click());
    expect(document.activeElement).toBe(wrapper.findNativeInput().getElement());
    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
  });

  test('focus lands on the right token when a hidden token is revealed by the removal', () => {
    mockVisibleCount = 2;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    act(() => dismissButton(wrapper, 2).click());
    expect(visibleLabels(wrapper)).toEqual(['a', 'b']);
    expect(document.activeElement).toBe(dismissButton(wrapper, 2));
  });
});

describe('keyboard navigation', () => {
  test('only one token is in the tab sequence', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    expect([1, 2, 3].map(i => dismissButton(wrapper, i).tabIndex)).toEqual([0, -1, -1]);
  });

  test('the overflow trigger is the tab stop when tokens are hidden', () => {
    mockVisibleCount = 1;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    expect(wrapper.findOverflowTrigger()!.getElement().tabIndex).toBe(0);
    expect(dismissButton(wrapper, 1).tabIndex).toBe(-1);
  });

  test('the tab stop follows the focused token while focus stays in the tokens', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    createWrapper(dismissButton(wrapper, 1)).focus();
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.right);
    expect([1, 2].map(i => dismissButton(wrapper, i).tabIndex)).toEqual([-1, 0]);
  });

  test('re-entering the tokens returns to the last focused token', () => {
    mockVisibleCount = 2;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    const trigger = wrapper.findOverflowTrigger()!.getElement();
    createWrapper(trigger).focus();
    createWrapper(trigger).keydown(KeyCode.right);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
    wrapper.findNativeInput().focus();
    expect(trigger.tabIndex).toBe(-1);
    expect([1, 2].map(i => dismissButton(wrapper, i).tabIndex)).toEqual([0, -1]);
  });

  test('arrow keys move between tokens and into the input', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    createWrapper(dismissButton(wrapper, 1)).focus();
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.right);
    expect(document.activeElement).toBe(dismissButton(wrapper, 2));
    createWrapper(dismissButton(wrapper, 2)).keydown(KeyCode.left);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.left);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.right);
    createWrapper(dismissButton(wrapper, 2)).keydown(KeyCode.right);
    expect(document.activeElement).toBe(wrapper.findNativeInput().getElement());
  });

  test('arrow keys follow the visual order in right-to-left layouts', () => {
    jest.mocked(getIsRtl).mockReturnValue(true);
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    createWrapper(dismissButton(wrapper, 1)).focus();
    createWrapper(dismissButton(wrapper, 1)).keydown(KeyCode.left);
    expect(document.activeElement).toBe(dismissButton(wrapper, 2));
    createWrapper(dismissButton(wrapper, 2)).keydown(KeyCode.right);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
  });

  test('Home focuses the first item and End focuses the input', () => {
    mockVisibleCount = 2;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b', 'c') });
    createWrapper(dismissButton(wrapper, 2)).focus();
    createWrapper(dismissButton(wrapper, 2)).keydown(KeyCode.home);
    expect(document.activeElement).toBe(wrapper.findOverflowTrigger()!.getElement());
    wrapper.findOverflowTrigger()!.keydown(KeyCode.end);
    expect(document.activeElement).toBe(wrapper.findNativeInput().getElement());
  });

  test('Backspace in an empty input focuses the last token without removing it', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a', 'b') });
    wrapper.findNativeInput().keydown(KeyCode.backspace);
    expect(document.activeElement).toBe(dismissButton(wrapper, 2));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Backspace in an empty input focuses the last token again after a token was removed', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    wrapper.findNativeInput().keydown(KeyCode.backspace);
    createWrapper(dismissButton(wrapper, 2)).keydown({ keyCode: 46 });
    wrapper.findNativeInput().focus();
    wrapper.findNativeInput().keydown(KeyCode.backspace);
    expect(visibleLabels(wrapper)).toEqual(['a']);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
  });

  test('Backspace in an empty input focuses the overflow trigger when all tokens are hidden', () => {
    mockVisibleCount = 0;
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    wrapper.findNativeInput().keydown(KeyCode.backspace);
    expect(document.activeElement).toBe(wrapper.findOverflowTrigger()!.getElement());
  });

  test('Backspace in a non-empty input keeps focus in the input', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a'), initialValue: 'x' });
    wrapper.findNativeInput().focus();
    wrapper.findNativeInput().keydown(KeyCode.backspace);
    expect(document.activeElement).toBe(wrapper.findNativeInput().getElement());
  });

  test('focusing a token does not open the suggestions, focusing the input does', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a') });
    createWrapper(dismissButton(wrapper, 1)).focus();
    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    act(() => dismissButton(wrapper, 1).blur());
    wrapper.focus();
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
  });
});

describe('overflow dropdown', () => {
  function renderOverflow(props: StatefulProps = {}) {
    mockVisibleCount = 1;
    const result = renderTokens({ initialTokens: toTokens('a', 'b', 'c', 'd'), ...props });
    const trigger = () => result.wrapper.findOverflowTrigger()!.getElement();
    const dropdown = () => result.wrapper.findOverflowDropdown();
    const dropdownDismiss = (index: number) => dropdown()!.findToken(index)!.findDismiss()!.getElement();
    return { ...result, trigger, dropdown, dropdownDismiss };
  }

  test('labels the trigger without announcing a listbox popup', () => {
    const { trigger } = renderOverflow({ i18nStrings: { tokenOverflowAriaLabel: count => `${count} more` } });
    expect(trigger()).toHaveAttribute('aria-label', '3 more');
    expect(trigger()).not.toHaveAttribute('aria-haspopup');
  });

  test('reports expand and collapse analytics on the trigger', () => {
    activateAnalyticsMetadata(true);
    const { trigger } = renderOverflow();
    expect(getGeneratedAnalyticsMetadata(trigger())).toEqual(expect.objectContaining({ action: 'expand' }));
    act(() => trigger().click());
    expect(getGeneratedAnalyticsMetadata(trigger())).toEqual(expect.objectContaining({ action: 'collapse' }));
    activateAnalyticsMetadata(false);
  });

  test('shows the number of hidden tokens on the trigger', () => {
    const { trigger, wrapper } = renderOverflow();
    expect(trigger()).toHaveTextContent('+3');
    expect(visibleLabels(wrapper)).toEqual(['d']);
  });

  test('has no trigger when all tokens fit', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a', 'b') });
    expect(wrapper.findOverflowTrigger()).toBeNull();
  });

  test('trigger toggles the dropdown listing hidden tokens', () => {
    const { trigger, dropdown } = renderOverflow();
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    act(() => trigger().click());
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(
      dropdown()!
        .findTokens()
        .map(token => token.getElement().textContent)
    ).toEqual(['a', 'b', 'c']);
    expect(document.getElementById(trigger().getAttribute('aria-controls')!)).toBe(dropdown()!.getElement());
    act(() => trigger().click());
    expect(dropdown()).toBeNull();
  });

  test('opening the overflow dropdown closes the suggestions', () => {
    const { trigger, wrapper } = renderOverflow();
    wrapper.focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(2);
    act(() => trigger().click());
    expect(wrapper.findDropdown().findOptions()).toHaveLength(0);
  });

  test('does not move focus into the dropdown on open', () => {
    const { trigger } = renderOverflow();
    createWrapper(trigger()).focus();
    act(() => trigger().click());
    expect(document.activeElement).toBe(trigger());
  });

  test('ArrowDown and ArrowUp from the trigger move focus into the dropdown', () => {
    const { trigger, dropdownDismiss } = renderOverflow();
    act(() => trigger().click());
    createWrapper(trigger()).focus();
    createWrapper(trigger()).keydown(KeyCode.down);
    expect(document.activeElement).toBe(dropdownDismiss(1));
    createWrapper(trigger()).focus();
    createWrapper(trigger()).keydown(KeyCode.up);
    expect(document.activeElement).toBe(dropdownDismiss(3));
  });

  test('ArrowDown on the closed trigger opens the dropdown and focuses the first token', () => {
    const { trigger, dropdown, dropdownDismiss } = renderOverflow();
    createWrapper(trigger()).focus();
    createWrapper(trigger()).keydown(KeyCode.down);
    expect(dropdown()).not.toBeNull();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(document.activeElement).toBe(dropdownDismiss(1));
  });

  test('ArrowUp on the closed trigger opens the dropdown and focuses the last token', () => {
    const { trigger, dropdown, dropdownDismiss } = renderOverflow();
    createWrapper(trigger()).focus();
    createWrapper(trigger()).keydown(KeyCode.up);
    expect(dropdown()).not.toBeNull();
    expect(document.activeElement).toBe(dropdownDismiss(3));
  });

  test('ArrowDown and ArrowUp cycle through dropdown tokens', () => {
    const { trigger, dropdownDismiss } = renderOverflow();
    act(() => trigger().click());
    createWrapper(dropdownDismiss(3)).focus();
    createWrapper(dropdownDismiss(3)).keydown(KeyCode.down);
    expect(document.activeElement).toBe(dropdownDismiss(1));
    createWrapper(dropdownDismiss(1)).keydown(KeyCode.up);
    expect(document.activeElement).toBe(dropdownDismiss(3));
  });

  test('Escape closes the dropdown and returns focus to the trigger', () => {
    const { trigger, dropdown, dropdownDismiss } = renderOverflow();
    act(() => trigger().click());
    createWrapper(dropdownDismiss(1)).focus();
    createWrapper(dropdownDismiss(1)).keydown({ keyCode: KeyCode.escape, key: 'Escape' });
    expect(dropdown()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('Tab closes the dropdown', () => {
    const { trigger, dropdown, dropdownDismiss } = renderOverflow();
    act(() => trigger().click());
    createWrapper(dropdownDismiss(1)).keydown({ keyCode: KeyCode.tab, key: 'Tab' });
    expect(dropdown()).toBeNull();
  });

  test('clicking outside closes the dropdown', () => {
    const { trigger, dropdown } = renderOverflow();
    act(() => trigger().click());
    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(dropdown()).toBeNull();
  });

  test('removing a token from the dropdown focuses the next one', () => {
    const { trigger, dropdown, dropdownDismiss, onChange } = renderOverflow();
    act(() => trigger().click());
    act(() => dropdownDismiss(2).click());
    expect(lastTokens(onChange)).toEqual(toTokens('a', 'c', 'd'));
    expect(document.activeElement).toBe(dropdownDismiss(2));
    expect(dropdown()!.findToken(2)!.getElement()).toHaveTextContent('c');
  });

  test.each([
    ['Backspace', KeyCode.backspace],
    ['Delete', 46],
  ])('%s on a dropdown token removes it and focuses the next one', (_, keyCode) => {
    const { trigger, dropdownDismiss, onChange } = renderOverflow();
    act(() => trigger().click());
    createWrapper(dropdownDismiss(2)).focus();
    createWrapper(dropdownDismiss(2)).keydown({ keyCode });
    expect(lastTokens(onChange)).toEqual(toTokens('a', 'c', 'd'));
    expect(document.activeElement).toBe(dropdownDismiss(2));
  });

  test('Backspace on a dropdown token does not remove it when read-only', () => {
    const { trigger, dropdownDismiss, onChange } = renderOverflow({ readOnly: true });
    act(() => trigger().click());
    createWrapper(dropdownDismiss(1)).keydown(KeyCode.backspace);
    expect(onChange).not.toHaveBeenCalled();
  });

  test.each([
    ['first', [1, 1, 1]],
    ['last', [3, 2, 1]],
    ['middle', [2, 1, 1]],
  ])('removing all hidden tokens starting from the %s one focuses the first visible token', (_, order) => {
    const { trigger, dropdown, dropdownDismiss, wrapper } = renderOverflow();
    act(() => trigger().click());
    for (const index of order) {
      act(() => dropdownDismiss(index).click());
    }
    expect(dropdown()).toBeNull();
    expect(wrapper.findOverflowTrigger()).toBeNull();
    expect(visibleLabels(wrapper)).toEqual(['d']);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
  });

  test('focuses the first visible token when a removal lets the remaining hidden tokens fit', () => {
    mockVisibleCount = 2;
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a', 'b', 'c', 'd') });
    act(() => wrapper.findOverflowTrigger()!.click());
    const dismissFirstHidden = wrapper.findOverflowDropdown()!.findToken(1)!.findDismiss()!.getElement();
    createWrapper(dismissFirstHidden).focus();
    mockVisibleCount = 3;
    act(() => dismissFirstHidden.click());
    expect(lastTokens(onChange)).toEqual(toTokens('b', 'c', 'd'));
    expect(wrapper.findOverflowTrigger()).toBeNull();
    expect(visibleLabels(wrapper)).toEqual(['b', 'c', 'd']);
    expect(document.activeElement).toBe(dismissButton(wrapper, 1));
  });

  test('does not move focus when hidden tokens become visible while focus is elsewhere in the field', () => {
    mockVisibleCount = 1;
    const tokens = toTokens('a', 'b');
    const { container, rerender } = render(
      <Autosuggest value="" onChange={() => {}} tokens={tokens} options={options} />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findOverflowTrigger()!.click());
    wrapper.findNativeInput().focus();
    mockVisibleCount = 2;
    rerender(<Autosuggest value="" onChange={() => {}} tokens={tokens} options={options} />);
    expect(wrapper.findOverflowDropdown()).toBeNull();
    expect(document.activeElement).toBe(wrapper.findNativeInput().getElement());
  });

  test('disabling the component closes an open dropdown', () => {
    mockVisibleCount = 1;
    const tokens = toTokens('a', 'b');
    const { container, rerender } = render(
      <Autosuggest value="" onChange={() => {}} tokens={tokens} options={options} />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findOverflowTrigger()!.click());
    expect(wrapper.findOverflowDropdown()).not.toBeNull();
    rerender(<Autosuggest value="" onChange={() => {}} tokens={tokens} options={options} disabled={true} />);
    expect(wrapper.findOverflowDropdown()).toBeNull();
    rerender(<Autosuggest value="" onChange={() => {}} tokens={tokens} options={options} />);
    expect(wrapper.findOverflowDropdown()).toBeNull();
  });

  test('trigger is disabled when the component is disabled', () => {
    const { trigger } = renderOverflow({ disabled: true });
    expect(trigger()).toBeDisabled();
  });

  test('hidden tokens can be inspected but not removed when read-only', () => {
    const { trigger, dropdownDismiss, onChange } = renderOverflow({ readOnly: true });
    act(() => trigger().click());
    act(() => dropdownDismiss(1).click());
    expect(onChange).not.toHaveBeenCalled();
    expect(dropdownDismiss(1)).toHaveAttribute('aria-disabled', 'true');
  });

  test('finds the dropdown rendered in a portal', () => {
    const { trigger, wrapper } = renderOverflow({ expandToViewport: true });
    act(() => trigger().click());
    expect(wrapper.findOverflowDropdown({ expandToViewport: true })!.findTokens()).toHaveLength(3);
  });
});

describe('input value', () => {
  test('clear button clears the value and keeps tokens', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a'), initialValue: 'x' });
    act(() => wrapper.findClearButton()!.click());
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { value: '', tokens: toTokens('a') } })
    );
  });

  test.each([{ readOnly: true }, { disabled: true }, {}])('clear button visibility when %o', props => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a'), initialValue: 'x', ...props });
    expect(!!wrapper.findClearButton()).toBe(!props.readOnly && !props.disabled);
  });

  test('has no clear button when the input is empty', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a') });
    expect(wrapper.findClearButton()).toBeNull();
  });

  test('typing keeps tokens in the change detail', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a') });
    wrapper.setInputValue('x');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { value: 'x', tokens: toTokens('a') } })
    );
  });

  test('Escape clears the value and keeps tokens', () => {
    const { wrapper, onChange } = renderTokens({ initialTokens: toTokens('a'), initialValue: 'x' });
    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { value: '', tokens: toTokens('a') } })
    );
  });
});

describe('i18n', () => {
  test('uses i18nStrings for labels', () => {
    mockVisibleCount = 1;
    const { wrapper } = renderTokens({
      initialTokens: toTokens('a', 'b'),
      i18nStrings: {
        tokenDismissLabel: value => `Remove ${value}`,
        tokenOverflowAriaLabel: count => `${count} hidden`,
      },
    });
    expect(dismissButton(wrapper, 1)).toHaveAttribute('aria-label', 'Remove b');
    expect(wrapper.findOverflowTrigger()!.getElement()).toHaveAttribute('aria-label', '1 hidden');
  });

  test('has no dismiss label when neither i18nStrings nor provider messages are given', () => {
    const { wrapper } = renderTokens({ initialTokens: toTokens('a') });
    expect(dismissButton(wrapper, 1)).not.toHaveAttribute('aria-label');
  });

  test.each([
    [2, '1 more item'],
    [1, '2 more items'],
  ])('uses provider messages with plural forms (%s visible)', (visibleCount, expected) => {
    mockVisibleCount = visibleCount;
    const { container } = render(
      <I18nProvider messages={[messages]} locale="en">
        <StatefulAutosuggest initialTokens={toTokens('a', 'b', 'c')} />
      </I18nProvider>
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    expect(wrapper.findOverflowTrigger()!.getElement()).toHaveAttribute('aria-label', expected);
    expect(dismissButton(wrapper, 1)).toHaveAttribute('aria-label', `Remove ${visibleCount === 2 ? 'b' : 'c'}`);
  });

  test('i18nStrings take precedence over provider messages', () => {
    const { container } = render(
      <I18nProvider messages={[messages]} locale="en">
        <StatefulAutosuggest initialTokens={toTokens('a')} i18nStrings={{ tokenDismissLabel: v => `Delete ${v}` }} />
      </I18nProvider>
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    expect(dismissButton(wrapper, 1)).toHaveAttribute('aria-label', 'Delete a');
  });
});
