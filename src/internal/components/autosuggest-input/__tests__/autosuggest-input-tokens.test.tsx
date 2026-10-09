// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render as renderJsx } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import { AutosuggestProps } from '../../../../../lib/components/autosuggest';
import AutosuggestInput, {
  AutosuggestInputRef,
} from '../../../../../lib/components/internal/components/autosuggest-input';
import { OverflowDropdown } from '../../../../../lib/components/internal/components/autosuggest-input/overflow-dropdown';
import AutosuggestInputWrapper from '../../../../../lib/components/test-utils/dom/internal/autosuggest-input';

let mockVisibleCount: number | undefined = undefined;
jest.mock('../../../../../lib/components/internal/components/autosuggest-input/use-token-overflow', () => ({
  useTokenOverflow: () => {
    const { useRef } = jest.requireActual<typeof import('react')>('react');
    return { containerRef: useRef(null), visibleCount: mockVisibleCount, tokenListMaxWidth: undefined };
  },
}));

function makeToken(value: string): AutosuggestProps.Token {
  return { value };
}

beforeEach(() => {
  mockVisibleCount = undefined;
});

interface RenderProps {
  value?: string;
  tokens?: AutosuggestProps.Token[];
  onChange?: (e: { detail: AutosuggestProps.ChangeDetail }) => void;
  disabled?: boolean;
  readOnly?: boolean;
  tokenDismissLabel?: (v: string) => string;
  tokenOverflowAriaLabel?: (n: number) => string;
  tokenInsertedAriaLabel?: string;
}

function render({ value = '', tokens = [], onChange = jest.fn(), ...rest }: RenderProps = {}) {
  const { container, rerender } = renderJsx(
    <AutosuggestInput value={value} onChange={onChange} tokens={tokens} {...rest} />
  );
  return { wrapper: new AutosuggestInputWrapper(container), container, rerender, onChange };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('token mode — rendering', () => {
  test('shows token trigger when tokens prop is provided', () => {
    const { wrapper } = render({ tokens: [makeToken('a')] });
    expect(wrapper.findTokenTrigger()).not.toBeNull();
  });

  test('hides token trigger when tokens prop is absent', () => {
    const { container } = renderJsx(<AutosuggestInput value="" onChange={() => {}} />);
    expect(new AutosuggestInputWrapper(container).findTokenTrigger()).toBeNull();
  });

  test('findInlineTokens returns empty array when not in token mode', () => {
    const { container } = renderJsx(<AutosuggestInput value="" onChange={() => {}} />);
    expect(new AutosuggestInputWrapper(container).findInlineTokens()).toEqual([]);
  });

  test('renders each token label', () => {
    const { wrapper } = render({ tokens: [makeToken('us-east-1'), makeToken('eu-west-1')] });
    expect(wrapper.findInlineToken(1)!.getElement()).toHaveTextContent('us-east-1');
    expect(wrapper.findInlineToken(2)!.getElement()).toHaveTextContent('eu-west-1');
  });

  test('no overflow pill when all tokens are visible', () => {
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b')] });
    expect(wrapper.findOverflowPill()).toBeNull();
  });

  test('overflow pill appears when mockVisibleCount hides tokens', () => {
    mockVisibleCount = 1;
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    expect(wrapper.findOverflowPill()).not.toBeNull();
    expect(wrapper.findOverflowPill()!.getElement()).toHaveTextContent('+2');
  });

  test('overflow pill aria-label uses tokenOverflowAriaLabel i18n prop', () => {
    mockVisibleCount = 0;
    const { container } = render({
      tokens: [makeToken('a'), makeToken('b'), makeToken('c')],
      tokenOverflowAriaLabel: n => `${n} more regions`,
    });
    const pill = container.querySelector('button[aria-haspopup="dialog"]')!;
    expect(pill).toHaveAttribute('aria-label', '3 more regions');
  });

  test('disabled state makes dismiss buttons aria-disabled (not focusable)', () => {
    const { container } = render({ tokens: [makeToken('a'), makeToken('b')], disabled: true });
    const buttons = container.querySelectorAll<HTMLButtonElement>('[data-token-item] button');
    buttons.forEach(btn => expect(btn).toHaveAttribute('aria-disabled', 'true'));
  });

  test('readOnly state renders dismiss buttons as aria-disabled (non-functional)', () => {
    const { container } = render({ tokens: [makeToken('a')], readOnly: true });
    const btn = container.querySelector<HTMLButtonElement>('[data-token-item] button');
    expect(btn).not.toBeNull();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  test('token with icon renders icon element inside the token', () => {
    const iconNode = <svg data-testid="token-icon" />;
    const { container } = render({ tokens: [{ value: 'a', icon: iconNode }] });
    expect(container.querySelector('[data-token-item] [class*="icon-inline"]')).not.toBeNull();
  });

  test('ariaLabel is applied to the group wrapper', () => {
    const { container } = renderJsx(
      <AutosuggestInput value="" onChange={() => {}} tokens={[makeToken('a')]} ariaLabel="Region filter" />
    );
    expect(container.querySelector('[role="group"]')).toHaveAttribute('aria-label', 'Region filter');
  });

  test('renders dropdownFooter without dropdownContent in token mode', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { container } = renderJsx(
      <AutosuggestInput
        ref={ref}
        value=""
        onChange={() => {}}
        tokens={[makeToken('a')]}
        dropdownFooter={<div data-testid="footer-only">footer</div>}
      />
    );
    act(() => ref.current?.open());
    expect(container.querySelector('[data-testid="footer-only"]')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Adding tokens
// ---------------------------------------------------------------------------
describe('token mode — adding tokens', () => {
  test('Enter on non-empty input fires onChange with new token and clears value', () => {
    const { wrapper, onChange } = render({ value: 'ap-east-1', tokens: [] });
    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: '', tokens: [{ value: 'ap-east-1' }] } })
    );
  });

  test('Enter on empty input does not fire onChange', () => {
    const { wrapper, onChange } = render({ value: '', tokens: [] });
    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Enter on whitespace-only input does not fire onChange', () => {
    const { wrapper, onChange } = render({ value: '   ', tokens: [] });
    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('token value is trimmed before being added', () => {
    const { wrapper, onChange } = render({ value: '  ap-east-1  ', tokens: [] });
    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: '', tokens: [{ value: 'ap-east-1' }] } })
    );
  });
});

// ---------------------------------------------------------------------------
// Dismissing tokens
// ---------------------------------------------------------------------------
describe('token mode — dismissing tokens', () => {
  test('clicking dismiss fires onChange without that token', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a'), makeToken('b')] });
    act(() => wrapper.findInlineToken(1)!.find('button')!.click());
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '', tokens: [{ value: 'b' }] } }));
  });

  test('dismissing last token fires onChange with empty array', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('only')] });
    act(() => wrapper.findInlineToken(1)!.find('button')!.click());
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '', tokens: [] } }));
  });

  test('Backspace on empty input focuses last token dismiss button (does not dismiss)', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a'), makeToken('b')], value: '' });
    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Backspace on non-empty input does nothing to tokens', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a')], value: 'x' });
    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Backspace on a token span removes that token', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a'), makeToken('b')] });
    const span = wrapper.findInlineToken(1)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.backspace, bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '', tokens: [{ value: 'b' }] } }));
  });

  test('Delete on a token span removes that token', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a'), makeToken('b')] });
    const span = wrapper.findInlineToken(2)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 46, bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '', tokens: [{ value: 'a' }] } }));
  });

  test('clicking dismiss button does not fire onChange when disabled', () => {
    const { container, onChange } = render({ tokens: [makeToken('a')], disabled: true });
    const btn = container.querySelector<HTMLButtonElement>('[data-token-item] button')!;
    act(() => btn.click());
    expect(onChange).not.toHaveBeenCalled();
  });

  test('clicking dismiss button does not fire onChange when readOnly', () => {
    const { container, onChange } = render({ tokens: [makeToken('a')], readOnly: true });
    const btn = container.querySelector<HTMLButtonElement>('[data-token-item] button')!;
    act(() => btn.click());
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------
describe('token mode — keyboard navigation', () => {
  test('ArrowLeft on second visible token focuses first token dismiss button', () => {
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const span = wrapper.findInlineToken(2)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    const firstBtn = wrapper.findInlineToken(1)!.find('button')!.getElement();
    const spy = jest.spyOn(firstBtn, 'focus');
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.left, bubbles: true }));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('ArrowRight on last visible token focuses the input', () => {
    const { wrapper, container } = render({ tokens: [makeToken('a'), makeToken('b')] });
    const span = wrapper.findInlineToken(2)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    const input = container.querySelector<HTMLElement>('[role="combobox"]')!;
    const spy = jest.spyOn(input, 'focus');
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.right, bubbles: true }));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('ArrowRight on non-last token focuses next token dismiss button', () => {
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const span = wrapper.findInlineToken(1)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    const nextBtn = wrapper.findInlineToken(2)!.find('button')!.getElement();
    const spy = jest.spyOn(nextBtn, 'focus');
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.right, bubbles: true }));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('ArrowLeft on first visible token does nothing when no overflow pill exists', () => {
    const { wrapper, onChange } = render({ tokens: [makeToken('a'), makeToken('b')] });
    const span = wrapper.findInlineToken(1)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.left, bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('ArrowLeft on first visible token focuses overflow pill when hidden tokens exist', () => {
    mockVisibleCount = 1;
    const { wrapper, container } = render({ tokens: [makeToken('hidden'), makeToken('visible')] });
    const span = wrapper.findInlineToken(1)!.getElement().closest<HTMLElement>('[data-token-item]')!;
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    const spy = jest.spyOn(pill, 'focus');
    span.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.left, bubbles: true }));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('Backspace on empty input focuses overflow pill when all tokens are hidden', () => {
    mockVisibleCount = 0;
    const { wrapper, container } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    const spy = jest.spyOn(pill, 'focus');
    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('ArrowDown fires onPressArrowDown when overflow panel is closed', () => {
    const onPressArrowDown = jest.fn();
    const { container } = renderJsx(
      <AutosuggestInput value="" onChange={() => {}} tokens={[]} onPressArrowDown={onPressArrowDown} />
    );
    new AutosuggestInputWrapper(container).findInput().findNativeInput().keydown(KeyCode.down);
    expect(onPressArrowDown).toHaveBeenCalled();
  });

  test('ArrowDown is blocked when overflow panel is open', () => {
    mockVisibleCount = 0;
    const onPressArrowDown = jest.fn();
    const { container } = renderJsx(
      <AutosuggestInput
        value=""
        onChange={() => {}}
        tokens={[makeToken('a'), makeToken('b'), makeToken('c')]}
        onPressArrowDown={onPressArrowDown}
      />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const input = container.querySelector<HTMLElement>('[role="combobox"]')!;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { keyCode: KeyCode.down, key: 'ArrowDown', bubbles: true, cancelable: true })
    );
    expect(onPressArrowDown).not.toHaveBeenCalled();
  });

  test('ArrowUp is blocked when overflow panel is open', () => {
    mockVisibleCount = 0;
    const onPressArrowUp = jest.fn();
    const { container } = renderJsx(
      <AutosuggestInput
        value=""
        onChange={() => {}}
        tokens={[makeToken('a'), makeToken('b'), makeToken('c')]}
        onPressArrowUp={onPressArrowUp}
      />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const input = container.querySelector<HTMLElement>('[role="combobox"]')!;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { keyCode: KeyCode.up, key: 'ArrowUp', bubbles: true, cancelable: true })
    );
    expect(onPressArrowUp).not.toHaveBeenCalled();
  });

  test('Escape clears a non-empty input value', () => {
    const { wrapper, onChange } = render({ value: 'hello', tokens: [] });
    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ value: '' }) }));
  });

  test('Enter during IME composition does not add a token', () => {
    const { container, onChange } = render({ value: 'hello', tokens: [] });
    const input = container.querySelector<HTMLElement>('[role="combobox"]')!;
    input.dispatchEvent(new Event('compositionstart', { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent('keydown', { keyCode: KeyCode.enter, key: 'Enter', bubbles: true, cancelable: true })
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Overflow pill & panel
// ---------------------------------------------------------------------------
describe('token mode — overflow pill and panel', () => {
  function renderWithOverflow(extraTokens = [makeToken('a'), makeToken('b'), makeToken('c')]) {
    mockVisibleCount = 0;
    const onChange = jest.fn();
    const { container, rerender } = renderJsx(<AutosuggestInput value="" onChange={onChange} tokens={extraTokens} />);
    return { container, rerender, onChange };
  }

  test('pill click opens the overflow panel', () => {
    const { container } = renderWithOverflow();
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    expect(wrapper(container).findOverflowPanel()).not.toBeNull();
    expect(pill).toHaveAttribute('aria-expanded', 'true');
  });

  test('second pill click closes the overflow panel', () => {
    const { container } = renderWithOverflow();
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    act(() => pill.click());
    expect(pill).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape key in the overflow panel closes it and returns focus to pill', () => {
    const { container } = renderWithOverflow();
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const spy = jest.spyOn(pill, 'focus');
    const panel = wrapper(container).findOverflowPanel()!.getElement();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(pill).toHaveAttribute('aria-expanded', 'false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('dismissing a token from the overflow panel fires onChange', () => {
    const { container, onChange } = renderWithOverflow();
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const firstBtn = wrapper(container).findOverflowPanel()!.getElement().querySelector<HTMLButtonElement>('button')!;
    act(() => firstBtn.click());
    expect(onChange).toHaveBeenCalled();
  });

  test('panel closes automatically when all tokens become visible', () => {
    mockVisibleCount = 1;
    const tokens = [makeToken('a'), makeToken('b'), makeToken('c')];
    const { container, rerender } = renderJsx(<AutosuggestInput value="" onChange={() => {}} tokens={tokens} />);
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    expect(pill).toHaveAttribute('aria-expanded', 'true');

    mockVisibleCount = undefined;
    act(() => rerender(<AutosuggestInput value="" onChange={() => {}} tokens={tokens} />));
    expect(container.querySelector('button[aria-haspopup="dialog"]')).toBeNull();
  });

  test('overflow panel is disabled (pill not clickable) when component is disabled', () => {
    mockVisibleCount = 0;
    const { container } = renderJsx(
      <AutosuggestInput value="" onChange={() => {}} tokens={[makeToken('a'), makeToken('b')]} disabled={true} />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    expect(pill).toBeDisabled();
  });

  test('overflow panel is accessible when component is readOnly (user can inspect hidden tokens)', () => {
    mockVisibleCount = 0;
    const { container } = renderJsx(
      <AutosuggestInput value="" onChange={() => {}} tokens={[makeToken('a'), makeToken('b')]} readOnly={true} />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    expect(pill).not.toBeDisabled();
    act(() => pill.click());
    expect(pill).toHaveAttribute('aria-expanded', 'true');
  });

  function wrapper(container: HTMLElement) {
    return new AutosuggestInputWrapper(container);
  }
});

// ---------------------------------------------------------------------------
// Clear button
// ---------------------------------------------------------------------------
describe('token mode — clear button', () => {
  test('renders clear button when input has text', () => {
    const { container } = render({ value: 'some-text', tokens: [] });
    expect(container.querySelector('[class*="input-icon-end"] button')).not.toBeNull();
  });

  test('does not render clear button when input is empty', () => {
    const { container } = render({ value: '', tokens: [] });
    expect(container.querySelector('[class*="input-icon-end"] button')).toBeNull();
  });

  test('does not render clear button when disabled', () => {
    const { container } = render({ value: 'text', disabled: true });
    expect(container.querySelector('[class*="input-icon-end"] button')).toBeNull();
  });

  test('does not render clear button when readOnly', () => {
    const { container } = render({ value: 'text', readOnly: true });
    expect(container.querySelector('[class*="input-icon-end"] button')).toBeNull();
  });

  test('clicking clear button fires onChange with empty value', () => {
    const { container, onChange } = render({ value: 'text', tokens: [] });
    const btn = container.querySelector<HTMLButtonElement>('[class*="input-icon-end"] button')!;
    act(() => btn.click());
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ value: '' }) }));
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe('token mode — accessibility', () => {
  test('first visible token dismiss button is in the tab order (tabIndex=0)', () => {
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b')] });
    expect(wrapper.findInlineToken(1)!.find('button')!.getElement().tabIndex).toBe(0);
  });

  test('subsequent token dismiss buttons are removed from tab order (tabIndex=-1)', () => {
    const { wrapper } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    expect(wrapper.findInlineToken(2)!.find('button')!.getElement().tabIndex).toBe(-1);
    expect(wrapper.findInlineToken(3)!.find('button')!.getElement().tabIndex).toBe(-1);
  });

  test('visible tokens carry correct aria-setsize and aria-posinset', () => {
    const { container } = render({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-token-item]'));
    expect(items).toHaveLength(3);
    items.forEach((li, i) => {
      expect(li.getAttribute('aria-setsize')).toBe('3');
      expect(li.getAttribute('aria-posinset')).toBe(String(i + 1));
    });
  });

  test('aria-setsize reflects full token count even when some are in overflow', () => {
    mockVisibleCount = 1;
    const { container } = render({ tokens: [makeToken('hidden'), makeToken('visible')] });
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-token-item]'));
    expect(items).toHaveLength(1);
    expect(items[0].getAttribute('aria-setsize')).toBe('2');
    expect(items[0].getAttribute('aria-posinset')).toBe('2');
  });

  test('live region is present in the document when in token mode', () => {
    render({ tokens: [] });
    expect(document.querySelector('[aria-live="assertive"]')).not.toBeNull();
  });

  test('live region is absent when not in token mode', () => {
    renderJsx(<AutosuggestInput value="" onChange={() => {}} />);
    expect(document.querySelector('[aria-live="assertive"]')).toBeNull();
  });

  test('tokenInsertedAriaLabel prop text is shown in the live region', () => {
    jest.useFakeTimers();
    render({ tokens: [], tokenInsertedAriaLabel: 'us-east-1 added' });
    act(() => jest.runAllTimers());
    expect(document.querySelector('[aria-live="assertive"]')?.textContent).toContain('us-east-1 added');
    jest.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// OverflowDropdown component
// ---------------------------------------------------------------------------
describe('OverflowDropdown', () => {
  function renderDropdown({
    tokens = [makeToken('a'), makeToken('b')],
    onDismiss = jest.fn(),
    onClose = jest.fn(),
    open = true,
    readOnly = false,
  } = {}) {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { container, rerender } = renderJsx(
      <div>
        <button ref={triggerRef as React.RefObject<HTMLButtonElement>}>Trigger</button>
        <OverflowDropdown
          tokens={tokens}
          triggerRef={triggerRef}
          open={open}
          onDismiss={onDismiss}
          onClose={onClose}
          readOnly={readOnly}
        />
      </div>
    );
    return { container, rerender, triggerRef, onDismiss, onClose };
  }

  test('renders nothing when open=false', () => {
    const { container } = renderDropdown({ open: false });
    expect(container.querySelector('[class*="overflow-panel"]')).toBeNull();
  });

  test('renders token dismiss buttons when open=true', () => {
    const { container } = renderDropdown({ tokens: [makeToken('a'), makeToken('b')] });
    expect(container.querySelectorAll('[class*="overflow-panel"] button')).toHaveLength(2);
  });

  test('onDismiss called with token index when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    const { container } = renderDropdown({ onDismiss });
    const buttons = container.querySelectorAll<HTMLButtonElement>('[class*="overflow-panel"] button');
    act(() => buttons[1].click());
    expect(onDismiss).toHaveBeenCalledWith(1);
  });

  test('tokens are not dismissible when readOnly', () => {
    const onDismiss = jest.fn();
    const { container } = renderDropdown({ onDismiss, readOnly: true });
    const buttons = container.querySelectorAll<HTMLButtonElement>('[class*="overflow-panel"] button');
    act(() => buttons[0].click());
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('Escape key calls onClose', () => {
    const onClose = jest.fn();
    const { container } = renderDropdown({ onClose });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(onClose).toHaveBeenCalled();
  });

  test('Tab key calls onClose', () => {
    const onClose = jest.fn();
    const { container } = renderDropdown({ onClose });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(onClose).toHaveBeenCalled();
  });

  test('ArrowDown moves focus to next button', () => {
    const { container } = renderDropdown({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    const buttons = panel.querySelectorAll<HTMLButtonElement>('button');
    act(() => buttons[0].focus());
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(buttons[1]);
  });

  test('ArrowDown wraps from last to first button', () => {
    const { container } = renderDropdown({ tokens: [makeToken('a'), makeToken('b')] });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    const buttons = panel.querySelectorAll<HTMLButtonElement>('button');
    act(() => buttons[buttons.length - 1].focus());
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);
  });

  test('ArrowUp moves focus to previous button', () => {
    const { container } = renderDropdown({ tokens: [makeToken('a'), makeToken('b'), makeToken('c')] });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    const buttons = panel.querySelectorAll<HTMLButtonElement>('button');
    act(() => buttons[1].focus());
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);
  });

  test('ArrowUp wraps from first to last button', () => {
    const { container } = renderDropdown({ tokens: [makeToken('a'), makeToken('b')] });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    const buttons = panel.querySelectorAll<HTMLButtonElement>('button');
    act(() => buttons[0].focus());
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  });

  test('outside click closes the panel', () => {
    const onClose = jest.fn();
    renderDropdown({ onClose });
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).toHaveBeenCalled();
  });

  test('click inside panel does not close the panel', () => {
    const onClose = jest.fn();
    const { container } = renderDropdown({ onClose });
    const panel = container.querySelector<HTMLElement>('[class*="overflow-panel"]')!;
    panel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('dismissing a token moves focus to the next token in the panel', () => {
    const onDismiss = jest.fn();
    const { container, rerender, triggerRef } = renderDropdown({
      tokens: [makeToken('a'), makeToken('b'), makeToken('c')],
      onDismiss,
    });
    const buttons = container.querySelectorAll<HTMLButtonElement>('[class*="overflow-panel"] button');
    act(() => buttons[0].click());
    // Rerender with token[0] removed — panel still has 2 tokens
    rerender(
      <div>
        <button ref={triggerRef as React.RefObject<HTMLButtonElement>}>Trigger</button>
        <OverflowDropdown
          tokens={[makeToken('b'), makeToken('c')]}
          triggerRef={triggerRef}
          open={true}
          onDismiss={onDismiss}
          onClose={jest.fn()}
        />
      </div>
    );
    const updatedButtons = container.querySelectorAll<HTMLButtonElement>('[class*="overflow-panel"] button');
    expect(document.activeElement).toBe(updatedButtons[0]);
  });

  test('dismissing the last token in the panel does not throw', () => {
    const onDismiss = jest.fn();
    const { container, rerender, triggerRef } = renderDropdown({
      tokens: [makeToken('only')],
      onDismiss,
    });
    const buttons = container.querySelectorAll<HTMLButtonElement>('[class*="overflow-panel"] button');
    act(() => buttons[0].click());
    // Rerender with empty tokens — pendingFocusAfterDismissRef fires but tokens.length === 0
    expect(() => {
      rerender(
        <div>
          <button ref={triggerRef as React.RefObject<HTMLButtonElement>}>Trigger</button>
          <OverflowDropdown tokens={[]} triggerRef={triggerRef} open={true} onDismiss={onDismiss} onClose={jest.fn()} />
        </div>
      );
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Focus management after overflow interactions
// ---------------------------------------------------------------------------
describe('token mode — focus management', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('dismissing last token focuses the input', () => {
    const { wrapper, container, rerender, onChange } = render({ tokens: [makeToken('a'), makeToken('b')] });
    act(() => wrapper.findInlineToken(1)!.find('button')!.click());
    rerender(<AutosuggestInput value="" onChange={onChange} tokens={[makeToken('b')]} />);
    const input = container.querySelector<HTMLElement>('[role="combobox"]')!;
    const focusSpy = jest.spyOn(input, 'focus');
    act(() => {
      rerender(<AutosuggestInput value="" onChange={onChange} tokens={[]} />);
    });
    act(() => jest.runAllTimers());
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  test('dismissing the only overflow token when visible tokens remain focuses first visible token', () => {
    mockVisibleCount = 2;
    const onChange = jest.fn();
    const tokens = [makeToken('a'), makeToken('b'), makeToken('c')];
    const { container, rerender } = renderJsx(
      <AutosuggestInput value="" onChange={onChange} tokens={tokens} tokenDismissLabel={(v: string) => `Remove ${v}`} />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const panel = new AutosuggestInputWrapper(container).findOverflowPanel()!;
    const dismissBtn = panel.find('button[aria-label]')!.getElement() as HTMLButtonElement;
    act(() => dismissBtn.click());
    // Simulate consumer removing the dismissed token; all remaining tokens now fit
    mockVisibleCount = undefined;
    const remainingTokens = [makeToken('b'), makeToken('c')];
    act(() => {
      rerender(
        <AutosuggestInput
          value=""
          onChange={onChange}
          tokens={remainingTokens}
          tokenDismissLabel={(v: string) => `Remove ${v}`}
        />
      );
    });
    act(() => jest.runAllTimers());
    const firstVisibleDismiss = container.querySelector<HTMLButtonElement>('[data-token-item] button');
    expect(document.activeElement).toBe(firstVisibleDismiss);
  });

  test('overflowOpen resets to false when hidden tokens become empty', () => {
    mockVisibleCount = 1;
    const tokens = [makeToken('a'), makeToken('b'), makeToken('c')];
    const { container, rerender } = renderJsx(<AutosuggestInput value="" onChange={() => {}} tokens={tokens} />);
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    expect(pill).toHaveAttribute('aria-expanded', 'true');
    mockVisibleCount = undefined;
    act(() => rerender(<AutosuggestInput value="" onChange={() => {}} tokens={tokens} />));
    expect(container.querySelector('button[aria-haspopup="dialog"]')).toBeNull();
  });

  test('ArrowRight on overflow pill focuses first visible token dismiss button', () => {
    mockVisibleCount = 1;
    const { wrapper, container } = render({ tokens: [makeToken('hidden'), makeToken('visible')] });
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    const firstToken = wrapper.findInlineToken(1)!.find('button')!.getElement();
    const spy = jest.spyOn(firstToken, 'focus');
    pill.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 /* ArrowRight */, bubbles: true }));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('Backspace on empty input when all tokens are hidden focuses the overflow pill', () => {
    mockVisibleCount = 0;
    const { wrapper, container } = render({ tokens: [makeToken('a'), makeToken('b')] });
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    const spy = jest.spyOn(pill, 'focus');
    wrapper.findInput().findNativeInput().keydown(39 /* just ensure Backspace path */);
    wrapper.findInput().findNativeInput().keydown(8 /* KeyCode.backspace */);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// i18n: tokenDismissLabel
// ---------------------------------------------------------------------------
describe('token mode — tokenDismissLabel i18n', () => {
  test('tokenDismissLabel prop sets the dismiss button aria-label for visible tokens', () => {
    const { container } = renderJsx(
      <AutosuggestInput
        value=""
        onChange={() => {}}
        tokens={[makeToken('us-east-1')]}
        tokenDismissLabel={(v: string) => `Remove ${v}`}
      />
    );
    const btn = container.querySelector<HTMLButtonElement>('[data-token-item] button')!;
    expect(btn).toHaveAttribute('aria-label', 'Remove us-east-1');
  });

  test('tokenDismissLabel prop sets the aria-label in the overflow panel', () => {
    mockVisibleCount = 0;
    const { container } = renderJsx(
      <AutosuggestInput
        value=""
        onChange={() => {}}
        tokens={[makeToken('eu-west-1')]}
        tokenDismissLabel={(v: string) => `Remove ${v}`}
      />
    );
    const pill = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    act(() => pill.click());
    const panelBtn = new AutosuggestInputWrapper(container)
      .findOverflowPanel()!
      .getElement()
      .querySelector<HTMLButtonElement>('button')!;
    expect(panelBtn).toHaveAttribute('aria-label', 'Remove eu-west-1');
  });
});
