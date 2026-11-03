// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { useTokenOverflow } from '../../../../../lib/components/internal/components/autosuggest-input/use-token-overflow';

import styles from '../../../../../lib/components/internal/components/autosuggest-input/styles.css.js';

interface Geometry {
  token: number;
  trigger: number;
  // Combined width of the tokens and the input, and how much of it the tokens take.
  available: number;
  tokensShare?: number;
  gap?: number;
  inputMinWidth?: string;
}

function setGeometry({ token, trigger, available, tokensShare = 0.5, gap = 0, inputMinWidth = '0px' }: Geometry) {
  const tokensWidth = Math.round(available * tokensShare);
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains(styles['measurement-token'])) {
      return token;
    }
    const widths = { trigger, tokens: tokensWidth, input: available - tokensWidth };
    return widths[this.dataset.part as keyof typeof widths] ?? 0;
  });
  const getComputedStyle = window.getComputedStyle;
  jest.spyOn(window, 'getComputedStyle').mockImplementation(element => {
    const style = getComputedStyle(element);
    const part = (element as HTMLElement).dataset.part;
    const overrides: Record<string, string> =
      part === 'tokens' ? { columnGap: `${gap}px` } : part === 'input' ? { minInlineSize: inputMinWidth } : {};
    return new Proxy(style, { get: (target, prop: string) => overrides[prop] ?? (target as any)[prop] });
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

interface HarnessProps {
  tokenCount: number;
  fieldWidth: number | null;
  enabled?: boolean;
  layoutKey?: string;
}

function Harness({ tokenCount, fieldWidth, enabled = true, layoutKey = '' }: HarnessProps) {
  const measureRef = React.useRef<HTMLDivElement>(null);
  const measureTriggerRef = React.useRef<HTMLSpanElement>(null);
  const tokensRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const visibleCount = useTokenOverflow({
    enabled,
    tokenCount,
    tokenContentKey: String(tokenCount),
    measureRef,
    measureTriggerRef,
    tokensRef,
    inputRef,
    fieldWidth,
    layoutKey,
  });
  return (
    <div>
      <div ref={measureRef} data-testid="measure">
        {Array.from({ length: tokenCount }, (_, i) => (
          <span key={i} className={styles['measurement-token']} />
        ))}
        <span ref={measureTriggerRef} data-part="trigger" />
      </div>
      <div>
        {tokenCount > 0 && <div ref={tokensRef} data-part="tokens" />}
        <input ref={inputRef} data-part="input" />
      </div>
      <output>{visibleCount}</output>
    </div>
  );
}

const visibleCountFor = (props: HarnessProps) =>
  Number(render(<Harness {...props} />).container.querySelector('output')!.textContent);

describe('useTokenOverflow', () => {
  test('shows all tokens before the field is measured', () => {
    setGeometry({ available: 0, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 5, fieldWidth: null })).toBe(5);
  });

  test('shows all tokens when disabled', () => {
    setGeometry({ available: 50, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 5, fieldWidth: 50, enabled: false })).toBe(5);
  });

  test('shows all tokens when they fit', () => {
    setGeometry({ available: 300, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 3, fieldWidth: 300 })).toBe(3);
  });

  test('keeps the trailing tokens that fit next to the overflow trigger', () => {
    setGeometry({ available: 240, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 5, fieldWidth: 240 })).toBe(2);
  });

  test('never shows a partially visible token', () => {
    setGeometry({ available: 229, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 5, fieldWidth: 229 })).toBe(1);
  });

  test('hides all tokens when none fit next to the trigger', () => {
    setGeometry({ available: 100, token: 100, trigger: 30 });
    expect(visibleCountFor({ tokenCount: 2, fieldWidth: 100 })).toBe(0);
  });

  test('accounts for the gaps between tokens', () => {
    setGeometry({ available: 300, token: 100, trigger: 30, gap: 4 });
    expect(visibleCountFor({ tokenCount: 3, fieldWidth: 300 })).toBe(2);
  });

  test('does not depend on how the field is currently split between tokens and input', () => {
    setGeometry({ available: 300, token: 100, trigger: 30, tokensShare: 0 });
    expect(visibleCountFor({ tokenCount: 3, fieldWidth: 300 })).toBe(3);
    jest.restoreAllMocks();
    setGeometry({ available: 300, token: 100, trigger: 30, tokensShare: 1 });
    expect(visibleCountFor({ tokenCount: 3, fieldWidth: 300 })).toBe(3);
  });

  test('re-measures when the field layout changes', () => {
    setGeometry({ available: 300, token: 100, trigger: 30 });
    const { container, rerender } = render(<Harness tokenCount={3} fieldWidth={300} layoutKey="valid" />);
    expect(container.querySelector('output')).toHaveTextContent('3');
    jest.restoreAllMocks();
    setGeometry({ available: 280, token: 100, trigger: 30 });
    rerender(<Harness tokenCount={3} fieldWidth={300} layoutKey="invalid" />);
    expect(container.querySelector('output')).toHaveTextContent('2');
  });

  test('shows all tokens while the field is hidden and re-measures when it is shown again', () => {
    setGeometry({ available: 0, token: 0, trigger: 0 });
    const { container, rerender } = render(<Harness tokenCount={5} fieldWidth={0} />);
    expect(container.querySelector('output')).toHaveTextContent('5');
    jest.restoreAllMocks();
    setGeometry({ available: 240, token: 100, trigger: 30 });
    rerender(<Harness tokenCount={5} fieldWidth={240} />);
    expect(container.querySelector('output')).toHaveTextContent('2');
  });

  test('makes the measurement copy inert even when there are no tokens', () => {
    setGeometry({ available: 300, token: 100, trigger: 30 });
    const { getByTestId } = render(<Harness tokenCount={0} fieldWidth={300} />);
    expect(getByTestId('measure').inert).toBe(true);
  });

  test('reserves the input minimum width defined in CSS', () => {
    setGeometry({ available: 399, token: 100, trigger: 30, inputMinWidth: '25%' });
    expect(visibleCountFor({ tokenCount: 3, fieldWidth: 399 })).toBe(2);
  });
});
