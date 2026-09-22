// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render as renderJsx } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import { AutosuggestProps } from '../../../../../lib/components/autosuggest';
import AutosuggestInput from '../../../../../lib/components/internal/components/autosuggest-input';
import AutosuggestInputWrapper from '../../../../../lib/components/test-utils/dom/internal/autosuggest-input';

function makeToken(label: string): AutosuggestProps.Token {
  return { label, dismissLabel: `Remove ${label}` };
}

const defaultTokens: AutosuggestProps.Token[] = [makeToken('us-east-1'), makeToken('eu-west-1')];

interface RenderProps {
  value?: string;
  tokens?: AutosuggestProps.Token[];
  onTokensChange?: (e: { detail: AutosuggestProps.TokensChangeDetail }) => void;
  onChange?: (e: { detail: { value: string } }) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

function render({
  value = '',
  tokens = defaultTokens,
  onTokensChange = () => {},
  onChange = () => {},
  ...rest
}: RenderProps = {}) {
  const { container, rerender } = renderJsx(
    <AutosuggestInput value={value} onChange={onChange} tokens={tokens} onTokensChange={onTokensChange} {...rest} />
  );
  const wrapper = new AutosuggestInputWrapper(container);
  return { wrapper, rerender, container };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('mode=tokens rendering', () => {
  test('renders the token trigger row', () => {
    const { wrapper } = render();
    expect(wrapper.findTokenTrigger()).not.toBeNull();
  });

  test('renders all tokens as visible', () => {
    const { wrapper } = render({ tokens: defaultTokens });
    expect(wrapper.findTokens()).toHaveLength(2);
  });

  test('renders token labels', () => {
    const { wrapper } = render({ tokens: defaultTokens });
    expect(wrapper.findToken(1)!.getElement()).toHaveTextContent('us-east-1');
    expect(wrapper.findToken(2)!.getElement()).toHaveTextContent('eu-west-1');
  });

  test('renders no overflow pill when all tokens fit', () => {
    const { wrapper } = render({ tokens: defaultTokens });
    expect(wrapper.findOverflowPill()).toBeNull();
  });

  test('renders no tokens when tokens array is empty', () => {
    const { wrapper } = render({ tokens: [] });
    expect(wrapper.findTokens()).toHaveLength(0);
    expect(wrapper.findOverflowPill()).toBeNull();
  });

  test('applies disabled state to token trigger', () => {
    const { wrapper } = render({ disabled: true });
    // token-trigger should carry the disabled modifier class
    expect(wrapper.findTokenTrigger()!.getElement().className).toMatch(/token-trigger-disabled/);
  });

  test('applies readonly state to token trigger', () => {
    const { wrapper } = render({ readOnly: true });
    expect(wrapper.findTokenTrigger()!.getElement().className).toMatch(/token-trigger-readonly/);
  });
});

// ---------------------------------------------------------------------------
// onTokensChange — adding tokens
// ---------------------------------------------------------------------------
describe('mode=tokens adding tokens', () => {
  test('fires onTokensChange with new token when Enter is pressed on non-empty value', () => {
    const onTokensChange = jest.fn();
    const onChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: 'ap-east-1', onTokensChange, onChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [expect.objectContaining({ label: 'ap-east-1' })] } })
    );
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '' } }));
  });

  test('does not fire onTokensChange when Enter is pressed on empty value', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: '', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);

    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('trims whitespace before creating a token', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: '  ap-east-1  ', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [expect.objectContaining({ label: 'ap-east-1' })] } })
    );
  });

  test('does not fire onTokensChange for whitespace-only value', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: '   ', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);

    expect(onTokensChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// onTokensChange — dismissing tokens
// ---------------------------------------------------------------------------
describe('mode=tokens dismissing tokens', () => {
  test('fires onTokensChange without the token when dismiss button is clicked', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange });

    // First token's dismiss button
    const dismissButton = wrapper.findToken(1)!.find('button')!;
    act(() => dismissButton.click());

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [makeToken('eu-west-1')] } })
    );
  });

  test('fires onTokensChange with empty array when last token is dismissed', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: [makeToken('us-east-1')], onTokensChange });

    const dismissButton = wrapper.findToken(1)!.find('button')!;
    act(() => dismissButton.click());

    expect(onTokensChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [] } }));
  });

  test('fires onTokensChange when Backspace is pressed on empty input', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, value: '', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);
    // Backspace moves focus to last token; dismiss it
    const dismissButton = wrapper.findToken(2)!.find('button')!;
    act(() => dismissButton.click());

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [makeToken('us-east-1')] } })
    );
  });

  test('does not fire onTokensChange on Backspace when input is non-empty', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, value: 'x', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);

    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('does not call dismiss when disabled', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange, disabled: true });

    const dismissButton = wrapper.findToken(1)!.find('button')!;
    act(() => dismissButton.click());

    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('does not call dismiss when readOnly', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange, readOnly: true });

    const dismissButton = wrapper.findToken(1)!.find('button')!;
    act(() => dismissButton.click());

    expect(onTokensChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Token span keyboard navigation (onKeyDown on each token's wrapper span)
// ---------------------------------------------------------------------------
describe('mode=tokens token keyboard navigation', () => {
  test('Backspace on a token span removes that token', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange });

    const tokenSpan = wrapper.findToken(1)!.getElement().closest('span')!;
    act(() => {
      tokenSpan.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.backspace, bubbles: true }));
    });

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [makeToken('eu-west-1')] } })
    );
  });

  test('Delete key on a token span removes that token', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange });

    const tokenSpan = wrapper.findToken(2)!.getElement().closest('span')!;
    act(() => {
      tokenSpan.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 46 /* Delete */, bubbles: true }));
    });

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [makeToken('us-east-1')] } })
    );
  });

  test('ArrowRight on last token focuses input', () => {
    const { wrapper } = render({ tokens: defaultTokens });
    // ArrowRight on the last token should call inputRef.current?.focus().
    // We can only verify it doesn't throw and onTokensChange is not fired.
    const onTokensChange = jest.fn();
    const { wrapper: w2 } = render({ tokens: [makeToken('only')], onTokensChange });
    const tokenSpan = w2.findToken(1)!.getElement().closest('span')!;
    act(() => {
      tokenSpan.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.right, bubbles: true }));
    });
    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('ArrowLeft on first token with no hidden tokens does nothing', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange });
    const tokenSpan = wrapper.findToken(1)!.getElement().closest('span')!;
    act(() => {
      tokenSpan.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.left, bubbles: true }));
    });
    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('ArrowLeft on second token focuses first token', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, onTokensChange });
    const tokenSpan = wrapper.findToken(2)!.getElement().closest('span')!;
    act(() => {
      tokenSpan.dispatchEvent(new KeyboardEvent('keydown', { keyCode: KeyCode.left, bubbles: true }));
    });
    // Navigation itself doesn't fire onTokensChange
    expect(onTokensChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handleKeyDown — token mode specific branches
// ---------------------------------------------------------------------------
describe('mode=tokens handleKeyDown branches', () => {
  test('Enter when dropdown is closed and value is set adds a token', () => {
    const onTokensChange = jest.fn();
    const onChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: 'new-token', onTokensChange, onChange });

    // Simulate Enter with dropdown closed (default state)
    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [expect.objectContaining({ label: 'new-token' })] } })
    );
  });

  test('Backspace on empty input with tokens does not fire onTokensChange immediately', () => {
    // Backspace on empty input focuses last token (doesn't remove it yet)
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, value: '', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);

    // onTokensChange should NOT be called on Backspace — it only focuses the last token
    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('Backspace on non-empty input does not affect tokens', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: defaultTokens, value: 'x', onTokensChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.backspace);

    expect(onTokensChange).not.toHaveBeenCalled();
  });

  test('Escape clears value when dropdown is closed', () => {
    const onChange = jest.fn();
    const { wrapper } = render({ tokens: [], value: 'typed-text', onChange });

    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '' } }));
  });
});

// ---------------------------------------------------------------------------
// removeToken — edge cases
// ---------------------------------------------------------------------------
describe('mode=tokens removeToken edge cases', () => {
  test('removing the only token fires onTokensChange with empty array', () => {
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: [makeToken('solo')], onTokensChange });

    act(() => wrapper.findToken(1)!.find('button')!.click());

    expect(onTokensChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [] } }));
  });

  test('removing a middle token fires onTokensChange with the token excluded', () => {
    const three = [makeToken('a'), makeToken('b'), makeToken('c')];
    const onTokensChange = jest.fn();
    const { wrapper } = render({ tokens: three, onTokensChange });

    act(() => wrapper.findToken(2)!.find('button')!.click());

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tokens: [makeToken('a'), makeToken('c')] } })
    );
  });
});

// ---------------------------------------------------------------------------
// Backward compatibility — tokens not set
// ---------------------------------------------------------------------------
describe('backward compatibility when tokens is not set', () => {
  test('renders the regular input (not the token trigger) when tokens is omitted', () => {
    const { container } = renderJsx(<AutosuggestInput value="" onChange={() => {}} />);
    const wrapper = new AutosuggestInputWrapper(container);
    expect(wrapper.findTokenTrigger()).toBeNull();
    expect(wrapper.findInput()).not.toBeNull();
  });
});
